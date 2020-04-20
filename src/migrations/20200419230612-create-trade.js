module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('trades', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    id_user1: {
      type: Sequelize.INTEGER,
    },
    id_user2: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    actual_offer: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.DATE,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('trades'),
};
