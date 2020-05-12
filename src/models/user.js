const bcrypt = require('bcrypt');
const crypto = require('crypto');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

async function buildToken(instance) {
  console.log("CREANDO TOKEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEN")
  if (instance.changed('token')) {
    const token = crypto.randomBytes(20).toString('hex');
    instance.set('token', token)
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username:{
      type: DataTypes.STRING,
      unique: true
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    usertype: DataTypes.INTEGER,  // 0 usuario, 1 admin, 2 superadmin
    isactive: DataTypes.INTEGER, // 0 inactive, 1 active, ...?
    token: DataTypes.STRING,
  }, {});

  user.beforeCreate(buildPasswordHash);
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildToken);
  user.beforeUpdate(buildToken);

  user.associate = function associate(models) {
    user.hasMany(models.evaluation);
    user.hasMany(models.object);
    user.belongsToMany(models.trade,{ through: 'UserTrade' })
    // associations can be defined here. This method receives a models parameter.
  };

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  return user;
};
