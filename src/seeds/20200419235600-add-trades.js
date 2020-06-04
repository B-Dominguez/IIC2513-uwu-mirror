module.exports = {
  up: (queryInterface) => {
    const tradesData = [
      {
        id_user1: 1,
        id_user2: 2,
        status: 0,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user1: 2,
        id_user2: 3,
        status: 0,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('trades', tradesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('trades', null, {}),
};
