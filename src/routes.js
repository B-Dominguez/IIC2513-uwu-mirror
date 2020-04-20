const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const objects = require('./routes/objects');
const offers = require('./routes/offers');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/objects', objects.routes());
router.use('/offers', objects.offers());

module.exports = router;
