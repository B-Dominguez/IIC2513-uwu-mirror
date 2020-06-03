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
    where: {token: ctx.session.token}
  });
  // Despues pasa al sgte middleware
  return next();
}

router.get('trades.list', '/', loadUserSession, async (ctx) => {
    const usersession = ctx.state.usersession;
    if (usersession && usersession.usertype == 2) {
      const tradesList = await ctx.orm.trade.findAll();
      await ctx.render('trades/index', {
          tradesList,
          newTradePath: ctx.router.url('trades.new'),
          editTradePath: (trade) => ctx.router.url('trades.edit', { id: trade.id}),
          deleteTradePath: (trade) => ctx.router.url('trades.delete', { id: trade.id}),
          showTradePath: (trade) => ctx.router.url('trades.show', { id: trade.id}),
      });
  } else {
    ctx.redirect('/');
  }
});

router.get('trades.show', '/:id/show', loadTrade, loadUserSession, async (ctx) => {
    const { trade } = ctx.state;
    const usersession = ctx.state.usersession;
    if (!usersession || ((usersession.id != trade.id_user1) &&
    (usersession.id != trade.id_user2) && (usersession.usertype == 0))) {
      // Si no se ha iniciado sesión, o es un usuario común que quiere ver
      // Los trades de otro usuario:
      ctx.redirect(ctx.router.url('/')); // Se puede cambiar por una página para 404
    } else {
      var superpermit = null;
      var offerIsMine = null;
      const tradeMessagesList = await ctx.orm.message.findAll({
        where: {tradeId: trade.id}});
      const tradeOffer = await ctx.orm.offer.findOne({
        where: {tradeId: trade.id},
        order: [ [ 'createdAt', 'DESC' ]],
      });
      var user1or2 = null;
      if (usersession) {
        superpermit = usersession.usertype == 2;
        if (usersession.id == trade.id_user1) {
          user1or2 = 1;
        }
        if (usersession.id == trade.id_user2) {
          user1or2 = 2;
        }
        if (tradeOffer && tradeOffer.sender == usersession.id ) {
          offerIsMine = true;
        }
      }
      await ctx.render('trades/show', {
          superpermit,
          trade,
          tradeMessagesList,
          tradeOffer,
          user1or2,
          offerIsMine,
          editTradePath: ctx.router.url('trades.edit', { id: trade.id}),
          deleteTradePath: ctx.router.url('trades.delete', { id: trade.id}),
          newMessagePath: ctx.router.url('messages.new', {tradeId: trade.id}),
          newOfferPath: ctx.router.url('offers.new', {tradeId: trade.id}),
          updateTradePath: ctx.router.url('trades.update', { id: trade.id }),
          updateOfferPath: (offer) => ctx.router.url('offers.update',
          { id: offer.id }),
          editMessagePath: (message) => ctx.router.url('messages.edit',
          { id: message.id}),
          deleteMessagePath: (message) => ctx.router.url('messages.delete',
          { id: message.id}),
          editOfferPath: (offer) => ctx.router.url('offers.edit',
          { id: offer.id}),
          deleteOfferPath: (offer) => ctx.router.url('offers.delete',
          { id: offer.id}),
      });
  }
});

router.get('trades.new', '/new', async(ctx) => {
    const trade = ctx.orm.trade.build();
    await ctx.render('trades/new', {
        trade,
        submitTradePath: ctx.router.url('trades.create'),
    });
});

router.post('trades.create', '/', loadUserSession, async (ctx) => {
    const usersession = ctx.state.usersession;
    if (!usersession) {
      // Si no se ha iniciado sesión
      ctx.redirect(ctx.router.url('/')); // Se puede cambiar por una página para 404
    } else {
      const trade = ctx.orm.trade.build(ctx.request.body);
      try {
          await trade.save({ fields: ['id_user1', 'id_user2', 'user1_confirms',
          'user2_confirms', 'status', 'date'] });
          ctx.redirect(ctx.router.url('trades.list'));
      } catch (validationError) {
          await ctx.render('trades/new', {
              trade,
              errors: validationError.errors,
              submitTradePath: ctx.router.url('trades.create'),
          })
      }
    }
});

router.get('trades.edit', '/:id/edit', loadTrade, loadUserSession, async (ctx) => {
    const usersession = ctx.state.usersession;
    const { trade } = ctx.state;
    if (!usersession || usersession) {
      ctx.redirect('/');
    } else {
      await ctx.render('trades/edit', {
          trade,
          submitTradePath: ctx.router.url('trades.update', { id: trade.id }),
      });
    }
});

router.patch('trades.update', '/:id', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    try {
        const {id_user1, id_user2, status, date, user1_confirms,
          user2_confirms} = ctx.request.body;
        await trade.update({id_user1, id_user2, status, user1_confirms,
          user2_confirms, date});

          if (trade.user1_confirms && trade.user2_confirms) {
            await trade.update({status: 3});
          }

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
