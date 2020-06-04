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
    where: {token: ctx.session.token}
  });
  // Despues pasa al sgte middleware
  return next();
}


router.get('offers.list', '/', loadUserSession, async (ctx) => {
  const usersession = ctx.state.usersession;
  if (usersession && usersession.usertype == 2) {
    const offersList = await ctx.orm.offer.findAll();
    await ctx.render('offers/index', {
      offersList,
      editOfferPath: (offer) => ctx.router.url('offers.edit', { id: offer.id }),
      deleteOfferPath: (offer) => ctx.router.url('offers.delete', { id: offer.id }),
    });
  } else {
    ctx.redirect('/');
  }
});


router.get('offers.new', '/new/:tradeId/:id1/:id2', loadUserSession, async (ctx) => {
  const usersession = ctx.state.usersession;
  if (!usersession) {
    // Si no se ha iniciado sesión, o es un usuario común que quiere ver
    // Los trades de otro usuario:
    ctx.redirect(ctx.router.url('/')); // Se puede cambiar por una página para 404
  }
  const userId = usersession.id
  const offer = ctx.orm.offer.build();
  const tradeId = ctx.params.tradeId;
  const id1 = ctx.params.id1;
  const id2 = ctx.params.id2;
  const user1 = await ctx.orm.user.findOne({
    where: {id: id1}});
  const user2 = await ctx.orm.user.findOne({
    where: {id: id2}});
  const user1ObjectsList = await ctx.orm.object.findAll({
    where: {userId: id1},
    order: [ [ 'id', 'DESC' ]],
  });
  const user2ObjectsList = await ctx.orm.object.findAll({
    where: {userId: id2},
    order: [ [ 'id', 'DESC' ]],
  });
  await ctx.render('offers/new', {
    offer,
    tradeId,
    user1,
    user2,
    user1ObjectsList,
    user2ObjectsList,
    userId,
    submitOfferPath: ctx.router.url('offers.create', {tradeId: tradeId}),
  });
});

router.post('offers.create', '/:tradeId', async (ctx) => {
  const offer = ctx.orm.offer.build(ctx.request.body);
  const tradeId = ctx.params.tradeId;
  try {
    await offer.save({ fields: [, 'name', 'description','status','tradeId',
    'sender'] });
        ctx.redirect(ctx.router.url('trades.show', {id: tradeId}));
  } catch (validationError) {
    await ctx.render('offers.new', {
      offer,
      errors: validationError.errors,
      submitOfferPath: ctx.router.url('offers.create', {id: tradeId}),
    });
  }
});

router.get('offers.edit', '/:id/edit', loadOffer, async (ctx) => {
  const { offer } = ctx.state;
  const tradeId = ctx.params.tradeId;
  await ctx.render('offers/edit', {
    offer,
    tradeId,
    submitOfferPath: ctx.router.url('offers.update', { id: offer.id }),
  });
});

router.patch('offers.update', '/:id', loadOffer, async (ctx) => {
  const { offer } = ctx.state;
  try {
    const {  name, description ,status} = ctx.request.body;
    await offer.update({ name, description, status });
    if (status && status == 2) {
      const trade = await ctx.orm.trade.findByPk(offer.tradeId);
      await trade.update({status: 2});
    }
    ctx.redirect(ctx.router.url('offers.list'));
  } catch (validationError) {
    await ctx.render('offers/edit', {
      offer,
      errors: validationError.errors,
      submitOfferPath: ctx.router.url('offers.update', { id: offer.id }),
    });
  }
});

router.del('offers.delete', '/:id', loadOffer, async (ctx) => {
  const { offer } = ctx.state;
  await offer.destroy();
  ctx.redirect(ctx.router.url('offers.list'));
});

module.exports = router;
