module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username:{
      type: DataTypes.STRING,
      unique: true
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rating: DataTypes.FLOAT,
  }, {});

  user.associate = function associate(models) {
    user.hasMany(models.evaluation);
    user.hasMany(models.object);
    user.belongsToMany(models.trade,{ through: 'UserTrade' })
    // associations can be defined here. This method receives a models parameter.
  };

  return user;
};
