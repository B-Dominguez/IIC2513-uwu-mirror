const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const trades = require('./routes/trades');
const messages = require('./routes/messages');
const users = require('./routes/users');
const evaluations = require('./routes/evaluations');
const objects = require('./routes/objects');
const offers = require('./routes/offers');
const session = require('./routes/session');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    currentUser: ctx.session.userId && await ctx.orm.user.findByPk(ctx.session.userId),
    newSessionPath: ctx.router.url('session.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    tradesPath: ctx.router.url('trades.list'),
  });
  return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/trades', trades.routes());
router.use('/messages', messages.routes());
router.use('/users', users.routes());
router.use('/evaluations', evaluations.routes());
router.use('/objects', objects.routes());
router.use('/offers', offers.routes());
router.use('/session', session.routes());
module.exports = router;
