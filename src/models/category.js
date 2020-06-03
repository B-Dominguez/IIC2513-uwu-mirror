module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
  }, {});

  category.associate = function associate(models) {
    category.hasMany(models.object);
  };
  return category;
};
