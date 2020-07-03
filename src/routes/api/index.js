const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const authApi = require('./auth');
const objectsApi = require('./objects');

const router = new KoaRouter();

// unauthenticated endpoints
router.use('/auth', authApi.routes());

// JWT authentication without passthrough (error if not authenticated)
router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userToken) {
    ctx.state.currentUser = await ctx.orm.user.findOne({where: { token: ctx.state.authData.userToken },});
  }
  return next();
});

// authenticated endpoints
router.use('/objects', objectsApi.routes());

module.exports = router;
