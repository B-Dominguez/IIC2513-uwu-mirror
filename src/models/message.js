module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    content: DataTypes.TEXT,
    date: DataTypes.DATE,
    sender: DataTypes.INTEGER,
    tradeId: DataTypes.INTEGER,
  }, {});

  message.associate = function associate(models) {
    message.belongsTo(models.trade);
    // associations can be defined here. This method receives a models parameter.
  };

  message.prototype.parsedCreatedAt = function() {
  return this.createdAt.getDate()+"/"+this.createdAt.getMonth()+"/"+
  this.createdAt.getFullYear()+" "+this.createdAt.getHours()+":"+this.createdAt.getMinutes();
};

  return message;
};
