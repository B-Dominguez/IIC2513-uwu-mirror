const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadObject(ctx, next) {
  ctx.state.object = await ctx.orm.object.findByPk(ctx.params.id);
  console.log(ctx.state.object);
  return next();
}

async function responseObject(ctx, object) {
  ctx.body = ctx.jsonSerializer('object', {
    attributes: ['name', 'description', 'categoryId', 'status', 'userId'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.object.show', { id: object.id })}`,
    },
  }).serialize(object);
}

router.get('api.objects.list', '/', async (ctx) => {
  const objectsList = await ctx.orm.object.findAll();
  ctx.body = ctx.jsonSerializer('object', {
    attributes: ['name', 'description', 'categoryId', 'status', 'userId'],
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
  await responseObject(ctx, object);
});


router.post('api.objects.create', '/', async (ctx) => {
  //var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
  //const bod = new JSONAPIDeserializer().deserialize(ctx.request.body);
  try {
    const bod = JSON.parse(ctx.request.body)
    const object = ctx.orm.object.build(bod);
    try {
      await object.save({ fields: ['name', 'description', 'categoryId', 'status', 'userId'] });
      await responseObject(ctx, object);
    } catch (validationError) {
      console.log("validation error");
    }
  } catch(err) {
    console.error(err)
  }
});


router.patch('objects.update', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  try {
      const bod = JSON.parse(ctx.request.body);
      console.log("bod-", bod);
      const {
        name, description, categoryId, status,
      } = bod;
      await object.update({
        name, description, categoryId, status,
      });
      await responseObject(ctx, object);
    } catch (validationError) {
      console.log("validation error");
    }
});

router.del('objects.delete', '/:id', loadObject, async (ctx) => {
  const { object } = ctx.state;
  await object.destroy();
  await responseObject(ctx, ctx.state.object);
});


module.exports = router;
