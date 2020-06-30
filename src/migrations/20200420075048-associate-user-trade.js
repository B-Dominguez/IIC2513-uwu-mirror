module.exports = {
  up: (queryInterface, Sequelize) =>
    // Product belongsToMany Tag
    queryInterface.createTable(
      'UserTrade',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        tradeId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      },
    ),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserTrade'),
};
