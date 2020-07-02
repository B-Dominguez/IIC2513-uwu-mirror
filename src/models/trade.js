module.exports = (sequelize, DataTypes) => {
  const trade = sequelize.define('trade', {
    id_user1: DataTypes.INTEGER,
    id_user2: DataTypes.INTEGER,
    status: DataTypes.INTEGER, // 0=canceled; 1=active; 2=promised; 3=done
    date: DataTypes.DATE,
    user1_confirms: DataTypes.INTEGER,
    user2_confirms: DataTypes.INTEGER,
  }, {});

  trade.associate = function associate(models) {
    trade.hasMany(models.message);
    trade.hasMany(models.offer);
    trade.belongsToMany(models.user, { through: 'UserTrade' });
  };

  return trade;
};
