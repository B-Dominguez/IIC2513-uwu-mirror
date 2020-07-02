const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadTrade(ctx, next) {
  ctx.state.trade = await ctx.orm.trade.findByPk(ctx.params.id);
  return next();
}

async function loadUserSession(ctx, next) {
  // Guardamos resultado (user) en state
  if (ctx.session.token == undefined) {
    ctx.state.usersession = null;
    return next();
  }
  ctx.state.usersession = await ctx.orm.user.findOne({
    where: { token: ctx.session.token },
  });
  // Despues pasa al sgte middleware
  return next();
}

router.get('trades.list', '/', loadUserSession, async (ctx) => {
  const { usersession } = ctx.state;
  if (usersession && usersession.usertype == 2) {
    const tradesList = await ctx.orm.trade.findAll();
    await ctx.render('trades/index', {
      tradesList,
      searchPath: ctx.router.url('objects.searchForm'),
      newTradePath: ctx.router.url('trades.new'),
      editTradePath: (trade) => ctx.router.url('trades.edit', { id: trade.id }),
      deleteTradePath: (trade) => ctx.router.url('trades.delete', { id: trade.id }),
      showTradePath: (trade) => ctx.router.url('trades.show', { id: trade.id }),
    });
  } else { // 401
    return ctx.throw(401, 'Unauthorized');
  }
});

router.get('trades.show', '/:id/show', loadTrade, loadUserSession, async (ctx) => {
  const { trade } = ctx.state;
  const message = ctx.orm.message.build();
  const { usersession } = ctx.state;
  if (!usersession || ((usersession.id != trade.id_user1)
    && (usersession.id != trade.id_user2) && (usersession.usertype == 0))) {
    // Si no se ha iniciado sesión, o es un usuario común no dueño
    return ctx.throw(401, 'Unauthorized');
  }
  const user1 = await ctx.orm.user.findByPk(trade.id_user1);
  const user2 = await ctx.orm.user.findByPk(trade.id_user2);
  let superpermit = null;
  let offerIsMine = null;
  const tradeMessagesList = await ctx.orm.message.findAll({ where: { tradeId: trade.id } });
  const tradeOffer = await ctx.orm.offer.findOne({
    where: { tradeId: trade.id },
    order: [['id', 'DESC']], // id en vez de created_at pq es PK y no necesito hacer index para que sea eficiente
  });

  let user1or2 = null;
  let userId = null;
  let otherId = null;
  var otherName = null;
  userId = usersession.id;
  superpermit = usersession.usertype == 2;
  if (usersession.id == trade.id_user1) {
    user1or2 = 1;
    otherId = trade.id_user2;
    otherName = user2.name;
  }
  if (usersession.id == trade.id_user2) {
    user1or2 = 2;
    otherId = trade.id_user1;
    otherName = user1.name;
  }
  if (tradeOffer && tradeOffer.sender == usersession.id) {
    offerIsMine = true;
  }

  const user1Name = user1.name;
  const user2Name = user2.name;
  const objects1 = [];
  const objects2 = [];
  let objectsAll = null;

  if (tradeOffer) {
    objectsAll = await tradeOffer.getObjects();

    // const objects1 = await ctx.orm.object.findAll({
    //   where: {userId: usersession.id}});
    // objects1.forEach ((object) => {
    //   objects1Array.push(object.id)
    // });

    // objectsAll.forEach ((object) => {
    //   if (!objects1Array.includes(object.id)) {
    //     objects2Array,push(object.id)
    //   }
    // }
    objectsAll.forEach((object) => {
      if (object.userId != usersession.id) {
        objects2.push(object);
      } else {
        objects1.push(object);
      }
    });
  }


  await ctx.render('trades/show', {
    otherName,
    objects1,
    objects2,
    userId,
    superpermit,
    trade,
    tradeMessagesList,
    tradeOffer,
    user1or2,
    user1Name,
    user2Name,
    offerIsMine,
    message,
    searchPath: ctx.router.url('objects.searchForm'),
    editTradePath: ctx.router.url('trades.edit', { id: trade.id }),
    deleteTradePath: ctx.router.url('trades.delete', { id: trade.id }),
    submitMessagePath: ctx.router.url('messages.create', { tradeId: trade.id }),
    newOfferPath: ctx.router.url('offers.new', { tradeId: trade.id, id1: userId,
      id2: otherId }),
    updateTradePath: ctx.router.url('trades.update', { id: trade.id }),
    updateOfferPath: (offer) => ctx.router.url('offers.update',
      { id: offer.id }),
    editMessagePath: (message) => ctx.router.url('messages.edit',
      { id: message.id }),
    deleteMessagePath: (message) => ctx.router.url('messages.delete',
      { id: message.id }),
    editOfferPath: (offer) => ctx.router.url('offers.edit',
      { id: offer.id }),
    deleteOfferPath: (offer) => ctx.router.url('offers.delete',
      { id: offer.id }),
    otherProfilePath: ctx.router.url('users.show',{id: otherId}),
    senderProfilePath: (message) => ctx.router.url('users.show',
    {id: message.sender}),
  });
});

router.get('trades.new', '/new', async (ctx) => {
  if (!usersession) {
    // Si no se ha iniciado sesión
    return ctx.throw(401, 'Unauthorized');
  }
  const trade = ctx.orm.trade.build();
  await ctx.render('trades/new', {
    trade,
    submitTradePath: ctx.router.url('trades.create'),
    searchPath: ctx.router.url('objects.searchForm'),
  });
});

router.post('trades.create', '/', loadUserSession, async (ctx) => {
  const { usersession } = ctx.state;
  if (!usersession) {
    // Si no se ha iniciado sesión
    return ctx.throw(401, 'Unauthorized');
  }
  const trade = ctx.orm.trade.build(ctx.request.body);
  try {
    await trade.save({
      fields: ['id_user1', 'id_user2', 'user1_confirms',
        'user2_confirms', 'status', 'date'],
    });
    ctx.redirect(ctx.router.url('trades.show', { id: trade.id }));
  } catch (validationError) {
    await ctx.render('trades/new', {
      trade,
      errors: validationError.errors,
      submitTradePath: ctx.router.url('trades.create'),
    });
  }
});

router.get('trades.edit', '/:id/edit', loadTrade, loadUserSession, async (ctx) => {
  if (!usersession) { // 401 mejorar
    // Si no se ha iniciado sesión
    return ctx.throw(401, 'Unauthorized');
  }
  const { usersession } = ctx.state;
  const { trade } = ctx.state;
  if (!usersession || usersession.id != 2) {
    ctx.redirect('/');
  } else {
    await ctx.render('trades/edit', {
      trade,
      submitTradePath: ctx.router.url('trades.update', { id: trade.id }),
      searchPath: ctx.router.url('objects.searchForm'),
    });
  }
});

router.patch('trades.update', '/:id', loadTrade, async (ctx) => {
  const { trade } = ctx.state;
  try {
    const {
      id_user1, id_user2, status, date, user1_confirms,
      user2_confirms,
    } = ctx.request.body;
    await trade.update({
      id_user1,
      id_user2,
      status,
      user1_confirms,
      user2_confirms,
      date,
    });

    if (trade.user1_confirms && trade.user2_confirms) {
      await trade.update({ status: 3 });
    }

    ctx.redirect(ctx.router.url('trades.show', { id: trade.id }));
  } catch (validationError) {
    await ctx.render('trades/edit', {
      trade,
      errors: validationError.errors,
      submitTradePath: ctx.router.url('trades.update', { id: trade.id }),
      searchPath: ctx.router.url('objects.searchForm'),

    });
  }
});

router.del('trades.delete', '/:id', loadTrade, async (ctx) => {
  if (!usersession) { // 401
    // Si no se ha iniciado sesión
    return ctx.throw(401, 'Unauthorized');
  }
  const { trade } = ctx.state;
  await trade.destroy();
  ctx.redirect(ctx.router.url('trades.list'));
});

module.exports = router;
