const spacePath = "https://guwuappspace1.sfo2.digitaloceanspaces.com/";
module.exports = (sequelize, DataTypes) => {
  const object = sequelize.define('object', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: DataTypes.STRING || 'available',
    image1: DataTypes.STRING,
    image2: DataTypes.STRING,
    image3: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, allowNull: false },
  }, {});

  object.associate = function associate(models) {
    object.belongsTo(models.user);
    object.belongsTo(models.category);
    object.belongsToMany(models.offer, { through: 'ObjectOffer' });
    // associations can be defined here. This method receives a models parameter.
  };

  object.prototype.getImagePath = function(number) {
    var image = null;
    switch (number) {
      case 1:
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        image = this.image1;
        break;
      case 2:
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
        image = this.image2;
        break;
      case 3:
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
        image = this.image3;
        break;
      default:
        //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
        return null;
    }
    if (image) {
      return spacePath+image;
    } else{
      return null;
    }
  };

  object.prototype.getFirstImagePath = function() {
    var i;
    var fimage = null;
    for (i = 1; i < 4; i++) {
      fimage = this.getImagePath(i);
      if (fimage) {
        return fimage;
      }
    }
    return "http://placehold.it/150x150";
  };

  object.prototype.parsedCreatedAt = function() {
  return this.createdAt.getDate() + "/" + this.createdAt.getMonth() + "/" +
  this.createdAt.getFullYear();
};

  return object;
};
