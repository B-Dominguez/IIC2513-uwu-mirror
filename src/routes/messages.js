const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadMessage(ctx, next) {
    ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
    return next();
}

router.get('messages.list', '/', async (ctx) => {
    const messagesList = await ctx.orm.message.findAll();
    await ctx.render('messages/index', {
        messagesList,
        editMessagePath: (message) => ctx.router.url('messages.edit', { id: message.id}),
        deleteMessagePath: (message) => ctx.router.url('messages.delete', { id: message.id}),
    });
});

router.get('messages.new', '/new/:tradeId', async(ctx) => {
    const message = ctx.orm.message.build();
    const tradeId = ctx.params.tradeId;
    await ctx.render('messages/new', {
        message,
        tradeId,
        submitMessagePath: ctx.router.url('messages.create', {tradeId: tradeId}),
    });
});

router.post('messages.create', '/:tradeId', async (ctx) => {
    const message = ctx.orm.message.build(ctx.request.body);
    const tradeId = ctx.params.tradeId;
    try {
        await message.save({ fields: ['content', 'sender', 'tradeId'] });
        ctx.redirect(ctx.router.url('trades.show', {id: tradeId}));
    } catch (validationError) {
        await ctx.render('messages/new', {
            message,
            errors: validationError.errors,
            submitMessagePath: ctx.router.url('messages.create', {id: tradeId}),
        })
    }
});

router.get('messages.edit', '/:id/edit', loadMessage, async(ctx) => {
    const { message } = ctx.state;
    await ctx.render('messages/edit', {
        message,
        submitMessagePath: ctx.router.url('messages.update', { id: message.id }),
    });
});

router.patch('messages.update', '/:id', loadMessage, async (ctx) => {
    const { message } = ctx.state;
    try {
        const {id_user1, id_user2, status, actual_offer, date, tradeId} = ctx.request.body;
        await message.update({id_user1, id_user2, status, actual_offer, date, tradeId});
        ctx.redirect(ctx.router.url('messages.list'));
    } catch (validationError) {
        await ctx.render('messages/edit', {
            message,
            errors: validationError.errors,
            submitMessagePath: ctx.router.url('messages.update', {id: message.id }),
        });
    }
});

router.del('messages.delete', '/:id', loadMessage, async (ctx) => {
    const { message } = ctx.state;
    await message.destroy();
    ctx.redirect(ctx.router.url('messages.list'));
});

module.exports = router;
