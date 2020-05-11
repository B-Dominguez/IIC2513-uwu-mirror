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
        usertype: 0,
      },
      {
        username: faker.internet.userName(),
        name: faker.name.findName(),
        phone: 123456789,
        address: faker.address.streetName(),
        email: 'user2@example.org',
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        rating: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usertype: 0,
      },
      {
        username: faker.internet.userName(),
        name: faker.name.findName(),
        phone: 123456789,
        address: faker.address.streetName(),
        email: 'user3@example.org',
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        rating: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usertype: 0,
      },
      {
        username: faker.internet.userName(),
        name: faker.name.findName(),
        phone: 123456789,
        address: faker.address.streetName(),
        email: 'admin@example.org',
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        rating: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usertype: 1,
      },
      {
        username: faker.internet.userName(),
        name: faker.name.findName(),
        phone: 123456789,
        address: faker.address.streetName(),
        email: 'superadmin@example.org',
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        rating: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        usertype: 2,
      },
    ];
    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
