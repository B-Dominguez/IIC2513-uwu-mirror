const KoaRouter = require('koa-router');
const { Op } = require('sequelize');
const router = new KoaRouter();
const fs = require('fs');
const fileStorage = require('../services/file-storage');

async function loadObject(ctx, next) {
  ctx.state.object = await ctx.orm.object.findByPk(ctx.params.id);
  console.log(ctx.state.object);
  return next();
}


// async function loadObjectByCat(ctx, next) {
//   ctx.state.object = await ctx.orm.object.findByPk(ctx.params.id);
//   return next();
// }

async function loadUserSession(ctx, next) {
  // Guardamos resultado (user) en state
  if (ctx.session.token == undefined) {
    ctx.state.usersession = null;
    return next();
  }
  ctx.state.usersession = await ctx.orm.user.findOne({
    where: {token: ctx.session.token}

  });
  // Despues pasa al sgte middleware
  return next();
}


router.get('objects.list', '/', loadUserSession, async (ctx) => {
  const usersession = ctx.state.usersession;
    if (usersession && usersession.usertype == 2) {
    const objectsList = await ctx.orm.object.findAll({order: [ [ 'id', 'DESC' ]]});
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('objects/index', {
      objectsList,
      categoriesList,
      newObjectPath: ctx.router.url('objects.new'),
      searchPath: ctx.router.url('objects.searchForm'),
      editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
      deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
      showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id}),
      showCategoryPath: (category) => ctx.router.url('categories.show', { id: category.id}),
    });
  } else {
    return ctx.throw(401, 'Unauthorized');
  }
});

router.get('objects.new', '/new', async (ctx) => {
  const object = ctx.orm.object.build();
  const categoriesList = await ctx.orm.category.findAll();
  await ctx.render('objects/new', {
    object,
    categoriesList,
    searchPath: ctx.router.url('objects.searchForm'),
    submitObjectPath: ctx.router.url('objects.create'),
  });
});

router.post('objects.create', '/', async (ctx) => {
  const object = ctx.orm.object.build(ctx.request.body);
  const { image1 } = ctx.request.files;
  try {
    await object.save({ fields: ['name', 'description','categoryId', 'status','userId'] });

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

router.get('objects.edit', '/:id/edit', loadObject, async (ctx) => {
  const { object } = ctx.state;
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
  const usersession = ctx.state.usersession;
  var userpermit = null;
  var superpermit = null;
  if (usersession) {
    userpermit = usersession.usertype == 2 || usersession.id == object.userId;
    superpermit = usersession.usertype == 2;
  }
  const seller = await ctx.orm.user.findOne({
    where: {id: object.userId}});
  // console.log(seller);

  await ctx.render('objects/show', {
    object,
    seller,
    userpermit,
    superpermit,
    searchPath: ctx.router.url('objects.searchForm'),
    editObjectPath: (object) => ctx.router.url('objects.edit',
    { id: object.id}),
    deleteObjectPath: (object) => ctx.router.url('objects.delete',
    { id: object.id}),
  });
});

router.post('objects.searchForm', 'objects/searchCat', async (ctx) => {
    const { searchCat } = ctx.request.body;
    ctx.redirect(ctx.router.url('objects.searchCat', {cat: searchCat}));
});

router.get('objects.searchCat', 'objects/:cat/searchCat', loadObject, async (ctx) => {
  const { object } = ctx.state;

  const objectsList = await ctx.orm.object.findAll({ where: {name: {[Op.like]: ctx.params.cat } } });
  await ctx.render('objects/searchCat', {
    objectsList,
    searchPath: ctx.router.url('objects.searchForm'),
    newObjectPath: ctx.router.url('objects.new'),
    editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
    deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
    showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id}),
  });
    });


router.patch('objects.update', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  console.log("hooooooooooooooooooooooooooooo");
  console.log('ctx.request.files', ctx.request.files);
  console.log('ctx.request.body', ctx.request.body);
  console.log('ctx.request.files.image1', ctx.request.files.image1);
  console.log(fileStorage);
  await fileStorage.upload(ctx.request.files.image1, 'imgtest.jpg');
  console.log("looooooooooooooooooooooooooooo");
  const { image1 } = ctx.request.files.image1;
  const { imagef } = ctx.request.files;
  console.log(imagef);
  try {
    console.log("Hay image?");
    if (image1.size == 0) {
      console.log("no hay image 1 \n");
    } else {
      console.log("Hay imagen \n");
    }
    console.log("deberias saber");
    const {  name, description,categoryId,status} = ctx.request.body;
    await object.update({ name, description,categoryId, status });
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

router.del('objects.delete', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  await object.destroy();
  ctx.redirect(ctx.router.url('users.myprofile'));
});

module.exports = router;
