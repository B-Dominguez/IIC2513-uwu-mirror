const KoaRouter = require('koa-router');
const router = new KoaRouter();

async function loadEvaluation(ctx, next) {
  // Guardamos resultado (evaluation) en state
  ctx.state.evaluation = await ctx.orm.evaluation.findByPk(ctx.params.id);
  // Despues pasa al sgte middleware
  return next();
}

router.get('evaluations.list', '/', async (ctx) => {
  const evaluationsList = await ctx.orm.evaluation.findAll();
  await ctx.render('evaluations/index', {
    evaluationsList,
    newEvaluationPath: ctx.router.url('evaluations.new'),
    editEvaluationPath: (evaluation) => ctx.router.url('evaluations.edit', { id: evaluation.id }),
    deleteEvaluationPath: (evaluation) => ctx.router.url('evaluations.delete', { id: evaluation.id }),
  });
  // equiv                        {evaluationsList: evaluationsList}
});

router.get('evaluations.new', '/new', async (ctx) => {
  const evaluation = ctx.orm.evaluation.build();
  await ctx.render('evaluations/new', {
    evaluation,
    submitEvaluationPath: ctx.router.url('evaluations.create'),
   });
  // equiv                        {evaluation: evaluation}
});

router.post('evaluations.create', '/', async (ctx) =>{
  const evaluation = ctx.orm.evaluation.build(ctx.request.body);
  try {
    await evaluation.save({ fields: ['rate',  'description']});
    ctx.redirect(ctx.router.url('evaluations.list'));
  } catch (validationError) {
    await ctx.render('evaluations.new', {
      evaluation,
      errors: validationError.errors,
      submitEvaluationPath: ctx.router.url('evaluations.create'),
    });
  }
});

router.get('evaluations.edit', '/:id/edit', loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;
  await ctx.render('evaluations/edit', {
    evaluation,
    submitEvaluationPath: ctx.router.url('evaluations.update', {id: evaluation.id}),
  });
});

router.patch('evaluations.update', '/:id', loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;
  try {
    const {rate, description} = ctx.request.body;
    await evaluation.update({rate, description});
    ctx.redirect(ctx.router.url('evaluations.list'));
  } catch (validationError) {
    await ctx.render('evaluations.edit', {
      evaluation,
      errors: validationError.errors,
      submitEvaluationPath: ctx.router.url('evaluations.update', {id: evaluation.id}),
    });
  }
});

router.del('evaluations.delete', '/:id/delete', loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;
  await evaluation.destroy();
  ctx.redirect(ctx.router.url('evaluations.list'));
});

module.exports = router;
