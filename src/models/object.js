module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define('object', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING ||'available',
    category: DataTypes.STRING,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING,
  }, {});

  object.associate = function associate(models) {
    object.belongsTo(models.user);
    object.belongsToMany(models.offer,{ through: 'ObjectOffer' })
    // associations can be defined here. This method receives a models parameter.
  };

  return object;
};
