const KoaRouter = require('koa-router');
const router = new KoaRouter();
const { Op } = require('sequelize');

async function loadUser(ctx, next) {
  // Guardamos resultado (user) en state
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  // Despues pasa al sgte middleware
  return next();
}

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
    showUserPath: (user) => ctx.router.url('users.show', { id: user.id}),
  });
  // equiv                        {usersList: usersList}
});


router.get('users.myprofile', '/myprofile', async (ctx) => {
  if (ctx.session){
    ctx.redirect(ctx.router.url('users.show', {id: ctx.session.userId}));   // cambiar por token
  } else {
    ctx.redirect(ctx.router.url('session.new')); // podria redirigirse al 404
  }
});


router.get('users.show', '/:id/show', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const userEvaluationsList = await ctx.orm.evaluation.findAll({
    where: {userId: user.id}});
    const userObjectsList = await ctx.orm.object.findAll({
      where: {userId: user.id}});
      await ctx.render('users/show', {
        user,
        userEvaluationsList,
        userObjectsList,
        editUserPath: ctx.router.url('users.edit', { id: user.id}),
        // falta new evaluation
        deleteUserPath: ctx.router.url('users.delete', { id: user.id}),
        editEvaluationPath: (evaluation) => ctx.router.url('evaluations.edit',
        { id: evaluation.id}),
        deleteEvaluationPath: (evaluation) => ctx.router.url('evaluations.delete',
        { id: evaluation.id}),
        editObjectPath: (object) => ctx.router.url('objects.edit',
        { id: object.id}),
        deleteObjectPath: (object) => ctx.router.url('objects.delete',
        { id: object.id}),
      });
    });

    router.get('users.trades', '/:id/trades', loadUser, async (ctx) => {
      const { user } = ctx.state;
      const usersession = await ctx.orm.user.findByPk(ctx.session.userId); // cambiar a token
      if (!(ctx.session) || ((usersession.id != user.id) &&
      (usersession.usertype == 0))) {
        // Si no se ha iniciado sesión, o es un usuario común que quiere ver
        // Los trades de otro usuario:
        ctx.redirect(ctx.router.url('users.list')); // Se puede cambiar por una página para 404
      } else {
        const userTrades = await ctx.orm.trade.findAll({
          where: {
            [Op.or]: [{id_user1: user.id}, {id_user2: user.id} ]
          }
        });;
        await ctx.render('users/trades', {
          userTrades,
          showTradePath: (trade) => ctx.router.url('trades.show', { id: trade.id}),
          editTradePath: (trade) => ctx.router.url('trades.edit', { id: trade.id}),
          deleteTradePath: (trade) => ctx.router.url('trades.delete', { id: trade.id}),
          // hay que ver si funciona o hay que pasarle el otro router
          // edit y delete solo se mostrarán a superadmin
          });
      }
    });


router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
   });
  // equiv                        {user: user}
});

router.post('users.create', '/', async (ctx) =>{
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({ fields: ['username',  'password', 'name', 'email',
    'usertype', 'phone', 'address', 'isactive', 'rating', 'token']});
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users.new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', {id: user.id}),
  });
});


router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {usertype, isactive, token, username, password, name, email, phone, address, rating} =
    ctx.request.body;
    await user.update({usertype, isactive, token, username, password, name, email, phone, address,
      rating});
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users.edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update', {id: user.id}),
    });
  }
});

router.del('users.delete', '/:id/delete', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

module.exports = router;
