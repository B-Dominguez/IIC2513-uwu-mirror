module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'ObjectOffer',
    {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      offerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      objectId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('ObjectOffer'),
};
