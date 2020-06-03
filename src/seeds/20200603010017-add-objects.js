module.exports = {
  up: (queryInterface) => {
    const objectsData = [
      {
        id: 1,
        name: 'Nintendo Switch',
        description: 'La vendo nueva',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
        image1: 'imagen1.png',
        image2: 'imagen2.png',
        categoryId: 1,
      },
      {
        id: 2,
        name: 'Notebook HP',
        description: 'Buen estado',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
        image1: 'imagen1.png',
        image2: 'imagen2.png',
        categoryId: 1,
      },
      {
        id: 3,
        name: 'Guitarra',
        description: 'Buena calidad',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
        image1: 'imagen1.png',
        image2: 'imagen2.png',
        categoryId: 2,
      },
    ];

    return queryInterface.bulkInsert('objects', objectsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('objects', null, {}),
};
