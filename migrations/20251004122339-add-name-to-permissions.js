// filepath: /Users/sarvadhisolution/Documents/Hackthon/LMS-Backend/migrations/xxxxxx-add-name-to-permissions.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("permissions", "name", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("permissions", "name");
  },
};
