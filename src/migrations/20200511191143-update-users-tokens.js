module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn(
      'users',
      'token',
      {
        type: Sequelize.STRING,
      },
    ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'token'),
};
