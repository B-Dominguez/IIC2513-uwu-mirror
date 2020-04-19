const KoaRouter = require('koa-router');
const router = new KoaRouter();

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', { usersList });
  // equiv                        {usersList: usersList}
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
   });
  // equiv                        {user: user}
});

router.post('users.create', '/', async (ctx) =>{
  const user = ctx.orm.user.build(ctx.request.body);
  try {
    await user.save({ fields: ['username',  'password', 'name', 'email',
    'phone', 'address', 'rating']});
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    await ctx.render('users.new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});


module.exports = router;
