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
      username: "bidominguez",
      name: "Benja Dom",
      phone: '974374321',
      address: 'colegio244',
      email: 'benjagmx@gmail.com',
      password: 'pass',
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 5.0,
      },
      {
      username: "bidominguez2",
      name: "Benja Dom2",
      phone: '974374321',
      address: 'colegio244',
      email: 'benjagmx@mail.com',
      password: 'pass',
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 4.9,
      }
    ];

    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('users', null, {});
  },
};
