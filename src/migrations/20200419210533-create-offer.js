module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('offers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    status: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    info: {
      type: Sequelize.STRING,
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

  down: (queryInterface) => queryInterface.dropTable('offers'),
};
