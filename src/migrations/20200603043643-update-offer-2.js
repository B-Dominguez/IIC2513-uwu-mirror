module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('offers', 'status'),
    queryInterface.addColumn(
      'offers',
      'status',
      {
        type: Sequelize.INTEGER,
      },
    ),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('offers', 'status'),
    queryInterface.addColumn(
      'offers',
      'status',
      {
        type: Sequelize.STRING,
      },
    ),
  ]),
};
