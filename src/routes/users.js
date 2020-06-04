const KoaRouter = require('koa-router');
const router = new KoaRouter();
const { Op } = require('sequelize');

async function loadUser(ctx, next) {
  // Guardamos resultado (user) en state
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  // Despues pasa al sgte middleware
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

router.get('users.list', '/', loadUserSession, async (ctx) => {
  const usersession = ctx.state.usersession;
  if (usersession && usersession.usertype == 2) {
    const usersList = await ctx.orm.user.findAll();
    await ctx.render('users/index', {
      usersList,
      searchPath: ctx.router.url('objects.searchForm'),
      newUserPath: ctx.router.url('users.new'),
      editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
      deleteUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
      showUserPath: (user) => ctx.router.url('users.show', { id: user.id}),
    });
  } else {
    return ctx.throw(401, 'Unauthorized');
  }
  // equiv                        {usersList: usersList}
});


router.get('users.myprofile', '/myprofile', loadUserSession, async (ctx) => {
  const usersession = ctx.state.usersession;
  if (usersession){
    ctx.redirect(ctx.router.url('users.show', {id: usersession.id}));   // cambiar por token
  } else {
    ctx.redirect(ctx.router.url('session.new')); // podria redirigirse al 404
  }
});


router.get('users.show', '/:id/show', loadUser, loadUserSession, async (ctx) => {
  const { user } = ctx.state;
  const usersession = ctx.state.usersession;
  var userpermit = null;
  var superpermit = null;
  if (usersession) {
    userpermit = usersession.usertype == 2 || usersession.id == user.id;
    superpermit = usersession.usertype == 2;
  }
  const userEvaluationsList = await ctx.orm.evaluation.findAll({
    where: {userId: user.id}
  });
    const userObjectsList = await ctx.orm.object.findAll({
      where: {userId: user.id}});
      await ctx.render('users/show', {
        user,
        userpermit,
        superpermit,
        userEvaluationsList,
        userObjectsList,
        editUserPath: ctx.router.url('users.edit', { id: user.id}),
        searchPath: ctx.router.url('objects.searchForm'),
        newObjectPath: ctx.router.url('objects.new'),
        deleteUserPath: ctx.router.url('users.delete', { id: user.id}),
        editEvaluationPath: (evaluation) => ctx.router.url('evaluations.edit',
        { id: evaluation.id}),
        deleteEvaluationPath: (evaluation) => ctx.router.url('evaluations.delete',
        { id: evaluation.id}),
        editObjectPath: (object) => ctx.router.url('objects.edit',
        { id: object.id}),
        deleteObjectPath: (object) => ctx.router.url('objects.delete',
        { id: object.id}),
        showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id}),

      });
    });



    router.get('users.trades', '/:id/trades', loadUser, loadUserSession, async (ctx) => {
      const { user } = ctx.state;
      const usersession = ctx.state.usersession;
      if (!usersession || ((usersession.id != user.id) &&
      (usersession.usertype == 0))) {
        // Si no se ha iniciado sesión, o es un usuario común que quiere ver
        // Los trades de otro usuario:
        return ctx.throw(401, 'Unauthorized');
      } else {
        const userTradesPromised = await ctx.orm.trade.findAll({
          where: {
            [Op.or]: [{id_user1: user.id}, {id_user2: user.id} ],
            status: 2,
          },
          order: [ [ 'id', 'DESC' ]],
        });
        const userTradesActive = await ctx.orm.trade.findAll({
          where: {
            [Op.or]: [{id_user1: user.id}, {id_user2: user.id} ],
            status: 1,
          },
          order: [ [ 'id', 'DESC' ]],
        });;
        const userTradesDone = await ctx.orm.trade.findAll({
          where: {
            [Op.or]: [{id_user1: user.id}, {id_user2: user.id} ],
            status: 3,
          },
          order: [ [ 'id', 'DESC' ]],
        });;
        const userTradesCanceled = await ctx.orm.trade.findAll({
          where: {
            [Op.or]: [{id_user1: user.id}, {id_user2: user.id} ],
            status: 0,
          },
          order: [ [ 'id', 'DESC' ]],
        });;

        await ctx.render('users/trades', {
          userTradesPromised,
          userTradesActive,
          userTradesDone,
          userTradesCanceled,
          searchPath: ctx.router.url('objects.searchForm'),
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
    searchPath: ctx.router.url('objects.searchForm'),
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

router.get('users.edit', '/:id/edit', loadUser, loadUserSession, async (ctx) => {
  const { user } = ctx.state;
  const usersession = ctx.state.usersession;
  if (!usersession || ((usersession.id != user.id) &&
  (usersession.usertype == 0))) {
    // Si no se ha iniciado sesión, o es un usuario común que quiere ver
    // Los trades de otro usuario:
    ctx.redirect(ctx.router.url('/')); // Se puede cambiar por una página para 404
  } else {
    await ctx.render('users/edit', {
      user,
      searchPath: ctx.router.url('objects.searchForm'),
      submitUserPath: ctx.router.url('users.update', {id: user.id}),
    });
  }
});


router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const {usertype, isactive, token, username, password, name, email, phone, address, rating} =
    ctx.request.body;
    await user.update({usertype, isactive, token, username, password, name, email, phone, address,
      rating});
    ctx.redirect(ctx.router.url('users.myprofile'));
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
