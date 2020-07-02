const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.objects.list', '/', async (ctx) => {
  const objectsList = await ctx.orm.object.findAll();
  ctx.body = ctx.jsonSerializer('object', {
    attributes: ['name', 'description', 'status'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.objects.list')}`,
    },
    dataLinks: {
      self: (dataset, object) => `${ctx.origin}/api/objects/${object.id}`,
    },
  }).serialize(objectsList);
});

router.get('api.object.show', '/:id', async (ctx) => {
  const object = await ctx.orm.object.findByPk(ctx.params.id);
  ctx.body = ctx.jsonSerializer('object', {
    attributes: ['name', 'description', 'status'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.object.show', { id: object.id })}`,
    },
  }).serialize(object);
});

module.exports = router;
