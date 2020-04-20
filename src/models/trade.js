module.exports = (sequelize, DataTypes) => {
  const trade = sequelize.define('trade', {
    id_user1: DataTypes.INTEGER,
    id_user2: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    actual_offer: DataTypes.INTEGER,
    date: DataTypes.DATE,
  }, {});

  trade.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return trade;
};
