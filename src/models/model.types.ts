// Shared type registry used when wiring Sequelize associations.
import type { Assessment } from './assessment.model';
import type { Assignment } from './assignment.model';
import type { Course } from './course.model';
import type { CourseAssessment } from './courseAssessment.model';
import type { CourseAssignment } from './courseAssignment.model';
import type { Employee } from './employee.model';
import type { EmployeePermission } from './employeePermission.model';
import type { Master } from './master.model';
import type { Module } from './module.model';
import type { Permission } from './permission.model';
import type { Role } from './role.model';
import type { RolePermission } from './rolePermission.model';
import type { SubMaster } from './subMaster.model';
import type { SystemEntity } from './systemEntity.model';
import type { User } from './user.model';

export interface ModelRegistry {
  Role: typeof Role;
  Permission: typeof Permission;
  RolePermission: typeof RolePermission;
  User: typeof User;
  Course: typeof Course;
  Module: typeof Module;
  Assignment: typeof Assignment;
  Assessment: typeof Assessment;
  CourseAssignment: typeof CourseAssignment;
  CourseAssessment: typeof CourseAssessment;
  Master: typeof Master;
  SubMaster: typeof SubMaster;
  Employee: typeof Employee;
  SystemEntity: typeof SystemEntity;
  EmployeePermission: typeof EmployeePermission;
}
