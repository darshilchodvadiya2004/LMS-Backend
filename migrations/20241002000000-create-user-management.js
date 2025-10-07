'use strict';

// Migration leveraging Sequelize models to materialise the schema via sync.
require('ts-node/register/transpile-only');

const { initializeModels } = require('../src/models');
const { connectToDatabase, syncDatabase, sequelize } = require('../src/config/db.config');

module.exports = {
  async up() {
    initializeModels();
    await connectToDatabase();
    await syncDatabase();
  },

  async down(queryInterface) {
    await queryInterface.dropTable('course_assessments');
    await queryInterface.dropTable('course_assignments');
    await queryInterface.dropTable('modules');
    await queryInterface.dropTable('assessments');
    await queryInterface.dropTable('assignments');
    await queryInterface.dropTable('courses');
    await queryInterface.dropTable('employee_permissions');
    await queryInterface.dropTable('system_entities');
    await queryInterface.dropTable('employees');
    await queryInterface.dropTable('sub_masters');
    await queryInterface.dropTable('masters');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('permissions');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('roles');
    await sequelize.close();
  },
};
