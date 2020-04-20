module.exports = (sequelize, DataTypes) => {
  const offer = sequelize.define('offer', {
    status: DataTypes.STRING,
    date: DataTypes.DATE,
    info: DataTypes.STRING,
  }, {});

  offer.associate = function associate(models) {
    offer.belongsTo(models.trade);
    offer.belongsToMany(models.object,{ through: 'ObjectOffer'} )
    // associations can be defined here. This method receives a models parameter.
  };

  return offer;
};
