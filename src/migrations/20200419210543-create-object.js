module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('objects', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    name: {
      type: Sequelize.STRING,
    },
    id: {
      type: Sequelize.INTEGER,
    },
    description: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    image1: {
      type: Sequelize.IMAGE,
    },
    image2: {
      type: Sequelize.IMAGE,
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

  down: (queryInterface) => queryInterface.dropTable('objects'),
};
