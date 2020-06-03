'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('offers','status'),
      queryInterface.addColumn(
        'offers',
        'status',
        {
          type: Sequelize.INTEGER,
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('offers','status'),
      queryInterface.addColumn(
        'offers',
        'status',
        {
          type: Sequelize.STRING,
        }
      ),
    ]);
  }
};
