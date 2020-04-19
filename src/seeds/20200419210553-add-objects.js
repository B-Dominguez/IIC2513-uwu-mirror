module.exports = {
  up: (queryInterface) => {
    const coursesData = [
      {
        name: 'Nintendo Switch',
        id: 1,
        description: 'La vendo nueva',
        status: 'available',
        category: 'tecnologia'
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Notebook HP',
        id: 2,
        description: 'Buen estado',
        status: 'available',
        category: 'tecnologia'
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Guitarra',
        id: 3,
        description: 'Buena calidad',
        status: 'available',
        category: 'instrumentos'
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('courses', coursesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('courses', null, {}),
};
