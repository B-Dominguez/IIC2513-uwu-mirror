const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();


router.get('objects.list', '/', async (ctx) => {
  const objectsList = await ctx.orm.object.findAll();
  await ctx.render('objects/index', {
    objectsList,
    newObjectPath: ctx.router.url('objects.new'),
    editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
    deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
  });
});

module.exports = router;
