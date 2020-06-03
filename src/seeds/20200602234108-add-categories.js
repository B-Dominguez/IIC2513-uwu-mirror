module.exports = {
  up: (queryInterface) => {
    const categoriesData = [
      {
        id: 1,
        name: 'Tecnologia',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Hogar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Moda',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('categories', categoriesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('categories', null, {}),
};
