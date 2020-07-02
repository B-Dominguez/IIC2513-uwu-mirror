module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    content: { type: DataTypes.TEXT, allowNull: false },
    date: DataTypes.DATE,
    sender: { type: DataTypes.INTEGER, allowNull: false },
    tradeId: { type: DataTypes.INTEGER, allowNull: false },
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
