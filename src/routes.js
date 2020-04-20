const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const users = require('./routes/users');
const evaluations = require('./routes/evaluations');
const objects = require('./routes/objects');
const offers = require('./routes/offers');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/users', users.routes());
router.use('/evaluations', evaluations.routes());
router.use('/objects', objects.routes());
router.use('/offers', offers.routes());
module.exports = router;
