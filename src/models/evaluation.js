module.exports = (sequelize, DataTypes) => {
  const evaluation = sequelize.define('evaluation', {
    rate: { type: DataTypes.FLOAT, allowNull: false },
    description:{ type: DataTypes.TEXT, allowNull: false },
  }, {});

  evaluation.associate = function associate(models) {
    evaluation.belongsTo(models.user);
    // associations can be defined here. This method receives a models parameter.
  };

  return evaluation;
};
