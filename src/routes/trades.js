const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadTrade(ctx, next) {
    ctx.state.trade = await ctx.orm.trade.findByPk(ctx.params.id);
    return next();
}

router.get('trades.list', '/', async (ctx) => {
    const tradesList = await ctx.orm.trade.findAll();
    await ctx.render('trades/index', {
        tradesList,
        newTradePath: ctx.router.url('trades.new'),
        editTradePath: (trade) => ctx.router.url('trades.edit', { id: trade.id}),
        deleteTradePath: (trade) => ctx.router.url('trades.delete', { id: trade.id}),
        showTradePath: (trade) => ctx.router.url('trades.show', { id: trade.id}),
    });
});

router.get('trades.show', '/:id/show', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    const tradeMessagesList = await ctx.orm.message.findAll({
      where: {tradeId: trade.id}});
    const tradeOffersList = await ctx.orm.offer.findAll({
      where: {tradeId: trade.id}});
    await ctx.render('trades/show', {
        trade,
        tradeMessagesList,
        tradeOffersList,
        editTradePath: ctx.router.url('trades.edit', { id: trade.id}),
        deleteTradePath: ctx.router.url('trades.delete', { id: trade.id}),
        newMessagePath: ctx.router.url('messages.new', {tradeId: trade.id}),
        newOfferPath: ctx.router.url('offers.new', {tradeId: trade.id}),
        editMessagePath: (message) => ctx.router.url('messages.edit',
        { id: message.id}),
        deleteMessagePath: (message) => ctx.router.url('messages.delete',
        { id: message.id}),
        editOfferPath: (offer) => ctx.router.url('offers.edit',
        { id: offer.id}),
        deleteOfferPath: (offer) => ctx.router.url('offers.delete',
        { id: offer.id}),
    });
});

router.get('trades.new', '/new', async(ctx) => {
    const trade = ctx.orm.trade.build();
    await ctx.render('trades/new', {
        trade,
        submitTradePath: ctx.router.url('trades.create'),
    });
});

router.post('trades.create', '/', async (ctx) => {
    const trade = ctx.orm.trade.build(ctx.request.body);
    try {
        await trade.save({ fields: ['id_user1', 'id_user2', 'status', 'date'] });
        ctx.redirect(ctx.router.url('trades.list'));
    } catch (validationError) {
        await ctx.render('trades/new', {
            trade,
            errors: validationError.errors,
            submitTradePath: ctx.router.url('trades.create'),
        })
    }
});

router.get('trades.edit', '/:id/edit', loadTrade, async(ctx) => {
    const { trade } = ctx.state;
    await ctx.render('trades/edit', {
        trade,
        submitTradePath: ctx.router.url('trades.update', { id: trade.id }),
    });
});

router.patch('trades.update', '/:id', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    try {
        const {id_user1, id_user2, status, date} = ctx.request.body;
        await trade.update({id_user1, id_user2, status, date});
        ctx.redirect(ctx.router.url('trades.list'));
    } catch (validationError) {
        await ctx.render('trades/edit', {
            trade,
            errors: validationError.errors,
            submitTradePath: ctx.router.url('trades.update', {id: trade.id }),
        });
    }
});

router.del('trades.delete', '/:id', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    await trade.destroy();
    ctx.redirect(ctx.router.url('trades.list'));
});

module.exports = router;
