"use strict";

const bcrypt = require("bcryptjs");

const now = () => new Date();

// 1️⃣ Create Roles
const createRoles = () => {
  const timestamp = now();
  return [
    {
      id: 1,
      name: "Admin",
      description: "System Administrator",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: 2,
      name: "Trainer",
      description: "Course Trainer",
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: 3,
      name: "Employee",
      description: "Regular Employee User",
      created_at: timestamp,
      updated_at: timestamp,
    },
  ];
};

// 2️⃣ Create Permissions
const createPermissions = () => {
  const timestamp = now();
  const modules = [
    { module: "user", actions: ["create", "edit", "delete", "view"] },
    { module: "role", actions: ["create", "edit", "delete", "view"] },
  ];

  let id = 1;
  const permissions = [];
  modules.forEach(({ module, actions }) => {
    actions.forEach((action) => {
      permissions.push({
        id,
        name: `${module.toUpperCase()}:${action.toUpperCase()}`,
        description: `Allows ${action} access for ${module}`,
        created_at: timestamp,
        updated_at: timestamp,
      });
      id += 1;
    });
  });

  return permissions;
};

// 3️⃣ Create Role-Permission Mapping
const createRolePermissions = (permissions) => {
  const timestamp = now();
  const entries = [];

  permissions.forEach((permission) => {
    // Admin gets all permissions
    entries.push({
      role_id: 1,
      permission_id: permission.id,
      created_at: timestamp,
      updated_at: timestamp,
    });

    // Trainer: Only view and edit user/role
    if (
      permission.name.includes(":VIEW") ||
      permission.name.includes(":EDIT")
    ) {
      entries.push({
        role_id: 2,
        permission_id: permission.id,
        created_at: timestamp,
        updated_at: timestamp,
      });
    }

    // Employee: Only view user/role
    if (permission.name.includes(":VIEW")) {
      entries.push({
        role_id: 3,
        permission_id: permission.id,
        created_at: timestamp,
        updated_at: timestamp,
      });
    }
  });

  return entries;
};

// 4️⃣ Create Users
const createUsers = () => {
  const timestamp = now();
  const passwordHash = bcrypt.hashSync("Admin@123", 10);

  return [
    {
      id: 1,
      first_name: "System",
      last_name: "Admin",
      username: "admin",
      email: "admin@example.com",
      password: passwordHash,
      role_id: 1,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: 2,
      first_name: "John",
      last_name: "Trainer",
      username: "trainer",
      email: "trainer@example.com",
      password: passwordHash,
      role_id: 2,
      created_at: timestamp,
      updated_at: timestamp,
    },
    {
      id: 3,
      first_name: "Jane",
      last_name: "Employee",
      username: "employee",
      email: "employee@example.com",
      password: passwordHash,
      role_id: 3,
      created_at: timestamp,
      updated_at: timestamp,
    },
  ];
};

// 5️⃣ Main Seeder
module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const roles = createRoles();
      const permissions = createPermissions();
      const rolePermissions = createRolePermissions(permissions);
      const users = createUsers();

      await queryInterface.bulkInsert("roles", roles, { transaction });
      await queryInterface.bulkInsert("permissions", permissions, {
        transaction,
      });
      await queryInterface.bulkInsert("role_permissions", rolePermissions, {
        transaction,
      });
      await queryInterface.bulkInsert("users", users, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("users", null, { transaction });
      await queryInterface.bulkDelete("role_permissions", null, {
        transaction,
      });
      await queryInterface.bulkDelete("permissions", null, { transaction });
      await queryInterface.bulkDelete("roles", null, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
