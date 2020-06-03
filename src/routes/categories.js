const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadCategory(ctx, next) {
  ctx.state.category = await ctx.orm.category.findByPk(ctx.params.id);
  return next();
}


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


router.get('categories.list', '/', loadUserSession, async (ctx) => {
  const usersession = ctx.state.usersession;
    if (usersession && usersession.usertype == 2) {
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('categories/index', {
      categoriesList,
      newCategoryPath: ctx.router.url('categories.new'),
      editCategoryPath: (category) => ctx.router.url('categories.edit', { id: category.id }),
      deleteCategoryPath: (category) => ctx.router.url('categories.delete', { id: category.id }),
      showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id}),
    });
  } else {
    ctx.redirect('/');
  }
});

router.get('categories.new', '/new', async (ctx) => {
  const category = ctx.orm.category.build();
  await ctx.render('categories/new', {
    category,
    submitCategoryPath: ctx.router.url('categories.create'),
  });
});

router.post('categories.create', '/', async (ctx) => {
  const category = ctx.orm.category.build(ctx.request.body);
  try {
    await category.save({ fields: ['name'] });
  } catch (validationError) {
    await ctx.render('categories.new', {
      category,
      errors: validationError.errors,
      submitCategoryPath: ctx.router.url('categories.create'),
    });
  }
});

router.get('categories.edit', '/:id/edit', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  await ctx.render('categories/edit', {
    category,
    submitCategoryPath: ctx.router.url('categories.update', { id: category.id }),
  });
});


router.get('categories.show', '/:id/show', loadCategory, async (ctx) => {
    const { category } = ctx.state;
    const categoryObjectsList = await ctx.orm.object.findAll({
        where: {categoryId: category.id}
        });
        await ctx.render('categories/show', {
          category,
          categoryObjectsList,
          newObjectPath: ctx.router.url('objects.new'),
          editObjectPath: (object) => ctx.router.url('objects.edit',
          { id: object.id}),
          deleteObjectPath: (object) => ctx.router.url('objects.delete',
          { id: object.id}),
          showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id}),

        });
      });



router.patch('categories.update', '/:id', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  try {
    const {  name} = ctx.request.body;
    await category.update({ name });
  } catch (validationError) {
    await ctx.render('categories/edit', {
      category,
      errors: validationError.errors,
      submitCategoryPath: ctx.router.url('categories.update', { id: category.id }),
    });
  }
});

router.del('categories.delete', '/:id', loadCategory, async (ctx) => {
  const { category } = ctx.state;
  await category.destroy();
});

module.exports = router;
