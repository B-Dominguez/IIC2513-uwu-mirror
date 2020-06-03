module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define('object', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING ||'available',
    image1: DataTypes.STRING,
    image2: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {});

  object.associate = function associate(models) {
    object.belongsTo(models.user);
    object.belongsTo(models.category);
    object.belongsToMany(models.offer,{ through: 'ObjectOffer' });
    // associations can be defined here. This method receives a models parameter.
  };

  return object;
};
