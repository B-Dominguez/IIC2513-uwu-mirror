module.exports = (sequelize, DataTypes) => {
  const evaluation = sequelize.define('evaluation', {
    rate: DataTypes.FLOAT,
    description: DataTypes.TEXT,
  }, {});

  evaluation.associate = function associate() {
    evaluation.belongsTo(models.user);
    // associations can be defined here. This method receives a models parameter.
  };

  return evaluation;
};
