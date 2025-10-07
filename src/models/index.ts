// Initialises all Sequelize models and their associations in a single location.
import { sequelize } from '../config/db.config';
import { Assessment } from './assessment.model';
import { Assignment } from './assignment.model';
import { Course } from './course.model';
import { CourseAssessment } from './courseAssessment.model';
import { CourseAssignment } from './courseAssignment.model';
import { Employee } from './employee.model';
import { EmployeePermission } from './employeePermission.model';
import { Master } from './master.model';
import { Module } from './module.model';
import { Permission } from './permission.model';
import { Role } from './role.model';
import { RolePermission } from './rolePermission.model';
import { SubMaster } from './subMaster.model';
import { SystemEntity } from './systemEntity.model';
import { User } from './user.model';

export const initializeModels = (): void => {
  Role.initialize(sequelize);
  Permission.initialize(sequelize);
  RolePermission.initialize(sequelize);
  User.initialize(sequelize);
  Course.initialize(sequelize);
  Module.initialize(sequelize);
  Assignment.initialize(sequelize);
  Assessment.initialize(sequelize);
  CourseAssignment.initialize(sequelize);
  CourseAssessment.initialize(sequelize);
  Master.initialize(sequelize);
  SubMaster.initialize(sequelize);
  Employee.initialize(sequelize);
  SystemEntity.initialize(sequelize);
  EmployeePermission.initialize(sequelize);

  const registry = {
    Role,
    Permission,
    RolePermission,
    User,
    Course,
    Module,
    Assignment,
    Assessment,
    CourseAssignment,
    CourseAssessment,
    Master,
    SubMaster,
    Employee,
    SystemEntity,
    EmployeePermission,
  } as const;

  Role.associate(registry);
  Permission.associate(registry);
  RolePermission.associate(registry);
  User.associate(registry);
  Course.associate(registry);
  Module.associate(registry);
  Assignment.associate(registry);
  Assessment.associate(registry);
  CourseAssignment.associate(registry);
  CourseAssessment.associate(registry);
  Master.associate(registry);
  SubMaster.associate(registry);
  Employee.associate(registry);
  SystemEntity.associate?.(registry);
  EmployeePermission.associate(registry);
};

export {
  Role,
  Permission,
  RolePermission,
  User,
  Course,
  Module,
  Assignment,
  Assessment,
  CourseAssignment,
  CourseAssessment,
  Master,
  SubMaster,
  Employee,
  SystemEntity,
  EmployeePermission,
};
