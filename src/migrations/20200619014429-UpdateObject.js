module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'objects',
    'image3',
    {
      type: Sequelize.STRING,
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('objects', 'image3'),
};
