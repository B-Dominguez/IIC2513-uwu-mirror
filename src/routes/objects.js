const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadObject(ctx, next) {
  ctx.state.object = await ctx.orm.object.findByPk(ctx.params.id);
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
    const objectsList = await ctx.orm.object.findAll();
    await ctx.render('objects/index', {
      objectsList,
      newObjectPath: ctx.router.url('objects.new'),
      searchPath: ctx.router.url('objects.searchForm'),
      editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
      deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
      showObjectPath: (object) => ctx.router.url('object.show', { id: object.id}),
    });
  } else {
    ctx.redirect('/');
  }
});

router.get('objects.new', '/new', async (ctx) => {
  const object = ctx.orm.object.build();
  await ctx.render('objects/new', {
    object,
    submitObjectPath: ctx.router.url('objects.create'),
  });
});

router.post('objects.create', '/', async (ctx) => {
  const object = ctx.orm.object.build(ctx.request.body);
  try {
    await object.save({ fields: ['name', 'description','category', 'status','userId'] });
    ctx.redirect(ctx.router.url('users.myprofile'));
  } catch (validationError) {
    await ctx.render('objects.new', {
      object,
      errors: validationError.errors,
      submitObjectPath: ctx.router.url('objects.create'),
    });
  }
});

router.get('objects.edit', '/:id/edit', loadObject, async (ctx) => {
  const { object } = ctx.state;
  await ctx.render('objects/edit', {
    object,
    submitObjectPath: ctx.router.url('objects.update', { id: object.id }),
  });
});


router.get('object.show', '/:id/show', loadObject, async (ctx) => {
  const { object } = ctx.state;
  await ctx.render('objects/show', {
    object,
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
  const objectsList = await ctx.orm.object.findAll({ where: { category:ctx.params.cat} });
  await ctx.render('objects/searchCat', {
    objectsList,
    searchPath: ctx.router.url('objects.searchForm'),
    newObjectPath: ctx.router.url('objects.new'),
    editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
    deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
    showObjectPath: (object) => ctx.router.url('object.show', { id: object.id}),
  });
    });


router.patch('objects.update', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  try {
    const {  name, description ,status} = ctx.request.body;
    await object.update({ name, description, status });
    ctx.redirect(ctx.router.url('users.myprofile'));
  } catch (validationError) {
    await ctx.render('objects/edit', {
      object,
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
