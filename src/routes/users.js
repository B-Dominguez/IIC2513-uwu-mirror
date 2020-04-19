const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', { usersList });
  // equiv                        {usersList: usersList}
});

module.exports = router;
