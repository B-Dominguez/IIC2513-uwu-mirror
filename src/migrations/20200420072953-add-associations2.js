'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'offers', // name of Source model
      'tradeId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'trades', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    )
     .then(() => {
        return queryInterface.addColumn(
          'messages', // name of Target model
          'tradeId', // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'trades', // name of Source model
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          }
        );
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'offers', // name of Source model
      'tradeId' // key we want to remove
    )
    .then(() => {
      return queryInterface.removeColumn(
        'offers', // name of the Target model
        'tradeId' // key we want to remove
      );
    });
}
};