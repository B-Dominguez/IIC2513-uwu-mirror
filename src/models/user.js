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
    usertype: DataTypes.INTEGER,  // 0 usuario, 1 admin, 2 superadmin
  }, {});

  user.associate = function associate(models) {
    user.hasMany(models.evaluation);
    user.hasMany(models.object);
    user.belongsToMany(models.trade,{ through: 'UserTrade' })
    // associations can be defined here. This method receives a models parameter.
  };

  return user;
};
