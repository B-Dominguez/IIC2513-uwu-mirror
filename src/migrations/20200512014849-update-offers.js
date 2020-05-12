'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return  queryInterface.addColumn(
      'offers',
      'sender',
      {
        type: Sequelize.INTEGER,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('offers','sender');
  }
};
