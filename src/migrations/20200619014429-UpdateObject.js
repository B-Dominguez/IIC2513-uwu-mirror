'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return  queryInterface.addColumn(
      'objects',
      'image3',
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('objects','image3');
  }
};
