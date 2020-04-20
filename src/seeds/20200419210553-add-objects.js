module.exports = {
  up: (queryInterface) => {
    const objectsData = [
      {
        name: 'Nintendo Switch',
        description: 'La vendo nueva',
        status: 'available',
        category: 'tecnologia',
        createdAt: new Date(),
        updatedAt: new Date(),
        image1: 'imagen1.png',
        image2: 'imagen2.png',

      },
      {
        name: 'Notebook HP',
        description: 'Buen estado',
        status: 'available',
        category: 'tecnologia',
        createdAt: new Date(),
        updatedAt: new Date(),
        image1: 'imagen1.png',
        image2: 'imagen2.png',
      },
      {
        name: 'Guitarra',
        description: 'Buena calidad',
        status: 'available',
        category: 'instrumentos',
        createdAt: new Date(),
        updatedAt: new Date(),
        image1: 'imagen1.png',
        image2: 'imagen2.png',
      },
    ];

    return queryInterface.bulkInsert('objects', objectsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('objects', null, {}),
};
