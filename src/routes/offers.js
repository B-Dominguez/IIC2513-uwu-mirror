const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadOffer(ctx, next) {
  ctx.state.offer = await ctx.orm.offer.findByPk(ctx.params.id);
  return next();
}

router.get('offers.list', '/', async (ctx) => {
  const offersList = await ctx.orm.offer.findAll();
  await ctx.render('offers/index', {
    offersList,
    newOfferPath: ctx.router.url('offers.new'),
    editOfferPath: (offer) => ctx.router.url('offers.edit', { id: offer.id }),
    deleteOfferPath: (offer) => ctx.router.url('offers.delete', { id: offer.id }),
  });
});

router.get('offers.new', '/new', async (ctx) => {
  const offer = ctx.orm.offer.build();
  await ctx.render('offers/new', {
    offer,
    submitOfferPath: ctx.router.url('offers.create'),
  });
});

router.post('offers.create', '/', async (ctx) => {
  const offer = ctx.orm.offer.build(ctx.request.body);
  try {
    await offer.save({ fields: [, 'name', 'description','status','tradeId'] });
    ctx.redirect(ctx.router.url('offers.list'));
  } catch (validationError) {
    await ctx.render('offers.new', {
      offer,
      errors: validationError.errors,
      submitOfferPath: ctx.router.url('offers.create'),
    });
  }
});

router.get('offers.edit', '/:id/edit', loadOffer, async (ctx) => {
  const { offer } = ctx.state;
  await ctx.render('offers/edit', {
    offer,
    submitOfferPath: ctx.router.url('offers.update', { id: offer.id }),
  });
});

router.patch('offers.update', '/:id', loadOffer, async (ctx) => {
  const { offer } = ctx.state;
  try {
    const {  name, description ,status} = ctx.request.body;
    await offer.update({ name, description, status });
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