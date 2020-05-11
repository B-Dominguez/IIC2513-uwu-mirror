const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const usersData = [
      {
        username: faker.internet.userName(),
        name: faker.name.findName(),
        phone: 123456789,
        address: faker.address.streetName(),
        email: 'user@example.org',
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        rating: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
