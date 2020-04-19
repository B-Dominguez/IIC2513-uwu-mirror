module.exports = (sequelize, DataTypes) => {
  const offer = sequelize.define('offer', {
    id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    date: DataTypes.DATE,
  }, {});

  offer.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return offer;
};
