'use strict';

// Seeder populating default roles, permissions, and their mapping from shared constants.
require('ts-node/register/transpile-only');

const { DEFAULT_ROLES, DEFAULT_PERMISSIONS, ROLE_PERMISSION_MAP } = require('../src/utils/constants');

const permissionKey = (module, action, roleId = null) => `${module}:${action}:${roleId ?? 'global'}`;

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date();

    await queryInterface.bulkInsert(
      'roles',
      DEFAULT_ROLES.map(({ name, description }) => ({
        name,
        description,
        created_at: timestamp,
        updated_at: timestamp,
      })),
      { ignoreDuplicates: true }
    );

    const existingPermissions = await queryInterface.sequelize.query(
      'SELECT module, action, role_id as "roleId" FROM permissions',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingKeys = new Set(
      existingPermissions.map(({ module, action, roleId }) => permissionKey(module, action, roleId))
    );

    const permissionsToInsert = DEFAULT_PERMISSIONS.filter(({ module, action }) => {
      const key = permissionKey(module, action);
      return !existingKeys.has(key);
    }).map(({ module, action }) => ({
      module,
      action,
      role_id: null,
      created_at: timestamp,
      updated_at: timestamp,
    }));

    if (permissionsToInsert.length) {
      await queryInterface.bulkInsert('permissions', permissionsToInsert, { ignoreDuplicates: true });
    }

    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM roles',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const permissions = await queryInterface.sequelize.query(
      'SELECT id, module, action FROM permissions',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const permissionIndex = permissions.reduce((acc, permission) => {
      acc[`${permission.module}:${permission.action}`] = permission.id;
      return acc;
    }, {});

    const roleIndex = roles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {});

    const rolePermissions = [];

    Object.entries(ROLE_PERMISSION_MAP).forEach(([roleName, permissionDefinitions]) => {
      const roleId = roleIndex[roleName];
      if (!roleId) {
        return;
      }

      permissionDefinitions.forEach(({ module, action }) => {
        const permissionId = permissionIndex[`${module}:${action}`];
        if (!permissionId) {
          return;
        }

        rolePermissions.push({
          role_id: roleId,
          permission_id: permissionId,
          created_at: timestamp,
          updated_at: timestamp,
        });
      });
    });

    if (rolePermissions.length) {
      await queryInterface.bulkInsert('role_permissions', rolePermissions, { ignoreDuplicates: true });
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('role_permissions', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  },
};
