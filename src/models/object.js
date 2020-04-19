module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define('object', {
    name: DataTypes.STRING,
    id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    category: DataTypes.STRING,
    image1: DataTypes.IMAGE,
    image2: DataTypes.IMAGE,
  }, {});

  object.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return object;
};
