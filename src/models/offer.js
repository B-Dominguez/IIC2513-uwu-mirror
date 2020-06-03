module.exports = (sequelize, DataTypes) => {
  const offer = sequelize.define('offer', {
    status: DataTypes.INTEGER, // 0=rejected ; 1 = pending ; 2 = accepted
    date: DataTypes.DATE,
    info: DataTypes.STRING,
    tradeId: DataTypes.INTEGER,
    sender: DataTypes.INTEGER,  // sin associate porque no necesitamos cascade
    // es un userId
  }, {});

  offer.associate = function associate(models) {
    offer.belongsTo(models.trade);
    offer.belongsToMany(models.object,{ through: 'ObjectOffer'} )
    // associations can be defined here. This method receives a models parameter.
  };

  return offer;
};
