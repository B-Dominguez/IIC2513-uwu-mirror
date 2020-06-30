module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'objects', // name of Source model
    'categoryId', // name of the key we're adding
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'categories', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'objects', // name of Source model
    'categoryId', // key we want to remove
  ),
};
