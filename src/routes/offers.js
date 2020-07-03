const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadOffer(ctx, next) {
  ctx.state.offer = await ctx.orm.offer.findByPk(ctx.params.id);
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

async function checkOfferOwner(ctx, next) {
  // Guardamos resultado (user) en state
  console.log("checkOfferOwner");
  ctx.state.offertOwner = false;
  if (ctx.state.offer) {
    if (ctx.state.usersession) {
      ctx.state.offerOwner = ctx.state.usersession.id == ctx.state.offer.userId;
    }
  }
  // Despues pasa al sgte middleware
  return next();
}

router.get('offers.list', '/', loadUserSession, async (ctx) => {
  const { usersession } = ctx.state;
  if (usersession && usersession.usertype == 2) {
    const offersList = await ctx.orm.offer.findAll();
    await ctx.render('offers/index', {
      offersList,
      editOfferPath: (offer) => ctx.router.url('offers.edit', { id: offer.id }),
      deleteOfferPath: (offer) => ctx.router.url('offers.delete', { id: offer.id }),
      searchPath: ctx.router.url('objects.searchForm'),
    });
  } else {
    return ctx.throw(401, 'Unauthorized');
  }
});

router.get('offers.new', '/new/:tradeId/:id1/:id2', loadUserSession, async (ctx) => {
  const { usersession } = ctx.state;
  if (!usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  const userId = usersession.id;
  const offer = ctx.orm.offer.build();
  const { tradeId } = ctx.params;
  const { id1 } = ctx.params;
  const { id2 } = ctx.params;
  const user1 = await ctx.orm.user.findOne({ where: { id: id1 } });
  const user2 = await ctx.orm.user.findOne({ where: { id: id2 } });
  const user1ObjectsList = await ctx.orm.object.findAll({
    where: { userId: id1 },
    order: [['id', 'DESC']],
  });
  const user2ObjectsList = await ctx.orm.object.findAll({
    where: { userId: id2 },
    order: [['id', 'DESC']],
  });
  await ctx.render('offers/new', {
    offer,
    tradeId,
    user1,
    user2,
    user1ObjectsList,
    user2ObjectsList,
    userId,
    submitOfferPath: ctx.router.url('offers.create', { tradeId }),
    searchPath: ctx.router.url('objects.searchForm'),
  });
});

router.post('offers.create', '/:tradeId', loadUserSession, async (ctx) => {
  const { usersession } = ctx.state;
  if (!usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  console.log(ctx.request.body);
  const offer = ctx.orm.offer.build(ctx.request.body);
  const { tradeId } = ctx.params;
  console.log(tradeId);
  try {
    await offer.save({
      fields: ['info', 'date', 'status', 'tradeId',
        'sender'],
    });
    ctx.request.body.items1.forEach((object) => {
      offer.setObjects(object);
    });
    ctx.redirect(ctx.router.url('trades.show', { id: tradeId }));
  } catch (validationError) {
    await ctx.render('offers.new', {
      offer,
      searchPath: ctx.router.url('objects.searchForm'),
      errors: validationError.errors,
      submitOfferPath: ctx.router.url('offers.create', { id: tradeId }),
    });
  }
});

router.get('offers.edit', '/:id/edit', loadOffer, loadUserSession,
loadAccessLevel, checkOfferOwner, async (ctx) => {
  const {usersession} = ctx.state;
  if (!usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  const { offer } = ctx.state;
  if (ctx.state.accessLevel < 2 && !ctx.state.offerOwner) {
    return ctx.throw(401, 'Unauthorized');
  }
  const { tradeId } = ctx.params;
  await ctx.render('offers/edit', {
    offer,
    searchPath: ctx.router.url('objects.searchForm'),
    tradeId,
    submitOfferPath: ctx.router.url('offers.update', { id: offer.id }),
  });
});

router.patch('offers.update', '/:id', loadOffer, loadUserSession,
loadAccessLevel, checkOfferOwner, async (ctx) => {
  const {usersession} = ctx.state;
  if (!usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  const { offer } = ctx.state;
  if (ctx.state.accessLevel < 2 && !ctx.state.offerOwner) {
    return ctx.throw(401, 'Unauthorized');
  }
  try {
    const { name, description, status } = ctx.request.body;
    await offer.update({ name, description, status });
    if (status && status == 2) {
      const trade = await ctx.orm.trade.findByPk(offer.tradeId);
      await trade.update({ status: 2 });
    }
    ctx.redirect(ctx.router.url('offers.list'));
  } catch (validationError) {
    await ctx.render('offers/edit', {
      offer,
      searchPath: ctx.router.url('objects.searchForm'),
      errors: validationError.errors,
      submitOfferPath: ctx.router.url('offers.update', { id: offer.id }),
    });
  }
});

router.del('offers.delete', '/:id', loadOffer, loadUserSession,
loadAccessLevel, checkOfferOwner, async (ctx) => {
  const {usersession} = ctx.state;
  if (!usersession) {
    return ctx.throw(401, 'Unauthorized');
  }
  const { offer } = ctx.state;
  if (ctx.state.accessLevel < 2 && !ctx.state.offerOwner) {
    return ctx.throw(401, 'Unauthorized');
  }
  await offer.destroy();
  ctx.redirect(ctx.router.url('offers.list'));
});

module.exports = router;
