const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const trades = require('./routes/trades');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/trades', trades.routes());

module.exports = router;
