module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'trades',
      'user1_confirms',
      {
        type: Sequelize.INTEGER,
      },
    ),
    queryInterface.addColumn(
      'trades',
      'user2_confirms',
      {
        type: Sequelize.INTEGER,
      },
    ),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('offers', 'user1_confirms'),
    queryInterface.removeColumn('offers', 'user2_confirms'),
  ]),
};
