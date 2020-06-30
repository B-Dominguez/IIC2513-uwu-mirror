module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'evaluations', // name of Source model
    'userId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'users', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
    .then(() => queryInterface.addColumn(
      'objects', // name of Target model
      'userId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    )),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'evaluations', // name of Source model
    'userId', // key we want to remove
  )
    .then(() => queryInterface.removeColumn(
      'objects', // name of the Target model
      'userId', // key we want to remove
    )),
};
