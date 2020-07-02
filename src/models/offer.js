module.exports = (sequelize, DataTypes) => {
  const offer = sequelize.define('offer', {
    status: { type: DataTypes.INTEGER, allowNull: false },
    // 0=rejected ; 1 = pending ; 2 = accepted
    date: { type: DataTypes.DATE, allowNull: false },
    info: { type: DataTypes.STRING, allowNull: false },
    tradeId: { type: DataTypes.INTEGER, allowNull: false },
    sender: { type: DataTypes.INTEGER, allowNull: false },
    // sin associate porque no necesitamos cascade
    // es un userId
  }, {});

  offer.associate = function associate(models) {
    offer.belongsTo(models.trade);
    offer.belongsToMany(models.object, { through: 'ObjectOffer' });
    // associations can be defined here. This method receives a models parameter.
  };

  return offer;
};
