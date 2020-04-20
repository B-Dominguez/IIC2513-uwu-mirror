module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    content: DataTypes.TEXT,
    date: DataTypes.DATE,
    sender: DataTypes.INTEGER,
    trade_id: DataTypes.INTEGER,
  }, {});

  message.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return message;
};
