const KoaRouter = require('koa-router');
const { Op } = require('sequelize');

const router = new KoaRouter();
const fs = require('fs');
const fileStorage = require('../services/file-storage');

async function loadObject(ctx, next) {
  console.log("loadObject");
  ctx.state.object = await ctx.orm.object.findByPk(ctx.params.id);
  console.log(ctx.state.object);
  return next();
}

async function loadUserSession(ctx, next) {
  // Guardamos resultado (user) en state
  console.log("loadUserSession");
  if (ctx.session.token == undefined) {
    ctx.state.usersession = null;
    ctx.state.accessLevel = null;
    return next();
  }
  ctx.state.usersession = await ctx.orm.user.findOne({
    where: { token: ctx.session.token },

  });
  if (ctx.state.usersession) {
    ctx.state.accessLevel = ctx.state.usersession.usertype;
  }
  // Despues pasa al sgte middleware
  return next();
}

async function loadAccessLevel(ctx, next) {
  // Guardamos resultado (user) en state
  console.log("loadAccessLevel");
  ctx.state.accessLevel = null;
  if (ctx.state.usersession) {
    ctx.state.accessLevel = ctx.state.usersession.usertype;
  }
  // Despues pasa al sgte middleware
  return next();
}

async function checkObjectOwner(ctx, next) {
  // Guardamos resultado (user) en state
  console.log("checkObjectOwner");
  ctx.state.objectOwner = false;
  if (ctx.state.object) {
    if (ctx.state.usersession) {
      ctx.state.objectOwner = ctx.state.usersession.id == ctx.state.object.userId;
    }
  }
  // Despues pasa al sgte middleware
  return next();
}

router.get('objects.list', '/', loadUserSession, async (ctx) => {
  const { usersession } = ctx.state;
  const objectsList = await ctx.orm.object.findAll({ order: [['id', 'DESC']] });
  const categoriesList = await ctx.orm.category.findAll();
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = objectsList;
      break;
    case 'html':
      if (usersession && usersession.usertype == 2) {
        await ctx.render('objects/index', {
          objectsList,
          categoriesList,
          newObjectPath: ctx.router.url('objects.new'),
          searchPath: ctx.router.url('objects.searchForm'),
          editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
          deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
          showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id }),
          showCategoryPath: (category) => ctx.router.url('categories.show', { id: category.id }),
        });
      } else {
        return ctx.throw(401, 'Unauthorized');
      }
      break;
    default:
      break;
  }
});

router.get('objects.new', '/new', loadUserSession, async (ctx) => {
  if (!ctx.state.usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  const object = ctx.orm.object.build();
  const categoriesList = await ctx.orm.category.findAll();
  await ctx.render('objects/new', {
    object,
    categoriesList,
    searchPath: ctx.router.url('objects.searchForm'),
    submitObjectPath: ctx.router.url('objects.create'),
  });
});

router.post('objects.create', '/', loadUserSession, async (ctx) => {
  if (!ctx.state.usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  console.log("body ", ctx.request.body);
  const object = ctx.orm.object.build(ctx.request.body);
  console.log("object", object);
  const size1 = ctx.request.files.image1.size;
  const size2 = ctx.request.files.image2.size;
  const size3 = ctx.request.files.image3.size;
  let image1 = null;
  let image2 = null;
  let image3 = null;
  try {
    await object.save({ fields: ['name', 'description', 'categoryId', 'status', 'userId'] });
    if (size1 == 0) {
      console.log('No hay image 1\n');
    } else {
      console.log('Hay imagen 1\n');
      image1 = `imgobject${object.id}-1.jpg`;
      ctx.request.files.image1.name = image1;
      await fileStorage.upload(ctx.request.files.image1);
    }
    if (size2 == 0) {
      console.log('No hay image 2\n');
    } else {
      console.log('Hay imagen 2\n');
      image2 = `imgobject${object.id}-2.jpg`;
      ctx.request.files.image2.name = image2;
      await fileStorage.upload(ctx.request.files.image2);
    }
    if (size3 == 0) {
      console.log('No hay image 3\n');
    } else {
      console.log('Hay imagen 3\n');
      image3 = `imgobject${object.id}-3.jpg`;
      ctx.request.files.image3.name = image3;
      await fileStorage.upload(ctx.request.files.image3);
    }
    await object.update({ image1, image2, image3 });
    ctx.redirect(ctx.router.url('users.myprofile'));
  } catch (validationError) {
    await ctx.render('objects.new', {
      object,
      searchPath: ctx.router.url('objects.searchForm'),
      errors: validationError.errors,
      submitObjectPath: ctx.router.url('objects.create'),
    });
  }
});

router.get('objects.edit', '/:id/edit', loadObject, loadUserSession,
loadAccessLevel, checkObjectOwner, async (ctx) => {
  const {usersession} = ctx.state;
  if (!usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  const { object } = ctx.state;
  if (ctx.state.accessLevel < 2 && !ctx.state.objectOwner) {
    return ctx.throw(401, 'Unauthorized');
  }
  const categoriesList = await ctx.orm.category.findAll();
  await ctx.render('objects/edit', {
    object,
    categoriesList,
    searchPath: ctx.router.url('objects.searchForm'),
    submitObjectPath: ctx.router.url('objects.update', { id: object.id }),
  });
});

router.get('objects.show', '/:id/show', loadObject, loadUserSession, async (ctx) => {
  const { object } = ctx.state;
  const { usersession } = ctx.state;
  let userpermit = null;
  let superpermit = null;
  if (usersession) {
    userpermit = usersession.usertype == 2 || usersession.id == object.userId;
    superpermit = usersession.usertype == 2;
  }
  const seller = await ctx.orm.user.findOne({ where: { id: object.userId } });
  // console.log(seller);

  await ctx.render('objects/show', {
    object,
    seller,
    userpermit,
    superpermit,
    searchPath: ctx.router.url('objects.searchForm'),
    editObjectPath: (object) => ctx.router.url('objects.edit',
      { id: object.id }),
    deleteObjectPath: (object) => ctx.router.url('objects.delete',
      { id: object.id }),
  });
});

router.post('objects.searchForm', 'objects/searchCat', async (ctx) => {
  const { searchCat } = ctx.request.body;
  if (searchCat) {
    ctx.redirect(ctx.router.url('objects.searchCat', { cat: searchCat }));
  } else {
    ctx.redirect(ctx.router.url('/'));
  }
});

router.get('objects.searchCat', 'objects/:cat/searchCat', loadObject, async (ctx) => {
  const { object } = ctx.state;
  const objectsList = await ctx.orm.object.findAll({
    where: { name: { [Op.like]: ctx.params.cat } },
    order: [['id', 'DESC']],
  });
  await ctx.render('objects/searchCat', {
    objectsList,
    searchPath: ctx.router.url('objects.searchForm'),
    newObjectPath: ctx.router.url('objects.new'),
    editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
    deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
    showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id }),
  });
});

router.patch('objects.update', '/:id', loadObject, loadUserSession,
loadAccessLevel, checkObjectOwner, async (ctx) => {
  const {usersession} = ctx.state;
  if (!usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  const { object } = ctx.state;
  if (ctx.state.accessLevel < 2 && !ctx.state.objectOwner) {
    return ctx.throw(401, 'Unauthorized');
  }
  const size1 = ctx.request.files.image1.size;
  const size2 = ctx.request.files.image2.size;
  const size3 = ctx.request.files.image3.size;
  let { image1 } = object;
  let { image2 } = object;
  let { image3 } = object;
  try {
    if (size1 == 0) {
      console.log('No hay image 1\n');
    } else {
      console.log('Hay imagen 1\n');
      image1 = `imgobject${object.id}-1.jpg`;
      ctx.request.files.image1.name = image1;
      await fileStorage.upload(ctx.request.files.image1);
    }
    if (size2 == 0) {
      console.log('No hay image 2\n');
    } else {
      console.log('Hay imagen 2\n');
      image2 = `imgobject${object.id}-2.jpg`;
      ctx.request.files.image2.name = image2;
      await fileStorage.upload(ctx.request.files.image2);
    }
    if (size3 == 0) {
      console.log('No hay image 3\n');
    } else {
      console.log('Hay imagen 3\n');
      image3 = `imgobject${object.id}-3.jpg`;
      ctx.request.files.image3.name = image3;
      await fileStorage.upload(ctx.request.files.image3);
    }
    console.log(ctx.request.body);
    const {
      name, description, categoryId, status,
    } = ctx.request.body;
    await object.update({
      name, description, categoryId, status, image1, image2, image3,
    });
    ctx.redirect(ctx.router.url('users.myprofile'));
  } catch (validationError) {
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('objects/edit', {
      object,
      categoriesList,
      searchPath: ctx.router.url('objects.searchForm'),
      errors: validationError.errors,
      submitObjectPath: ctx.router.url('objects.update', { id: object.id }),
    });
  }
});

router.del('objects.delete', '/:id', loadObject, loadUserSession,
loadAccessLevel, checkObjectOwner, async (ctx) => {
  const {usersession} = ctx.state;
  if (!usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  const { object } = ctx.state;
  if (ctx.state.accessLevel < 2 && !ctx.state.objectOwner) {
    return ctx.throw(401, 'Unauthorized');
  }
  await object.destroy();
  ctx.redirect(ctx.router.url('users.myprofile'));
});

module.exports = router;
