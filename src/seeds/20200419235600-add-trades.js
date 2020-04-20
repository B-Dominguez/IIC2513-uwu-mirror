module.exports = {
  up: (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const tradesData = [
      {
        id_user1: 1,
        id_user2: 2,
        status: 0,
        actual_offer: 1,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user1: 2,
        id_user2: 3,
        status: 0,
        actual_offer: 2,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('trades', tradesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('trades', null, {}),
};
