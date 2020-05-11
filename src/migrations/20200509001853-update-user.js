'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'usertype',
        {
          type: Sequelize.INTEGER,
        }
      ),
      queryInterface.removeColumn('trades','actual_offer'),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users','usertype'),
      queryInterface.addColumn(
        'trades',
        'actual_offer',
        {
          type: Sequelize.INTEGER,
        }
      ),
    ])
  }
};
