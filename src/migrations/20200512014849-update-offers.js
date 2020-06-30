module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'offers',
    'sender',
    {
      type: Sequelize.INTEGER,
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('offers', 'sender'),
};
