const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();

router.post('auth', '/', async (ctx) => {
  console.log("entro a intentar post auth");
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { email } });
  if (user && await user.checkPassword(password)) {
    const token = await new Promise((resolve, reject) => {
      jwtgenerator.sign(
        { userToken: user.token },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
      );
    });
    ctx.body = { token };
  } else {
    ctx.throw(401, 'Wrong e-mail or password');
  }
});

module.exports = router;
