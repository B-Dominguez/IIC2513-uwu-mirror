const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('objects.list', '/', async (ctx) => {
  const objectsList = await ctx.orm.object.findAll({ order: [['id', 'DESC']] });
  const categoriesList = await ctx.orm.category.findAll();
  await ctx.render('objects/index', {
    objectsList,
    categoriesList,
    newObjectPath: ctx.router.url('objects.new'),
    searchPath: ctx.router.url('objects.searchForm'),
    editObjectPath: (object) => ctx.router.url('objects.edit', { id: object.id }),
    deleteObjectPath: (object) => ctx.router.url('objects.delete', { id: object.id }),
    showObjectPath: (object) => ctx.router.url('objects.show', { id: object.id }),
    showCategoryPath: (category) => ctx.router.url('categories.show', { id: category.id }),
  });
});

module.exports = router;
