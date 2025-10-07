// Provides business logic for employee-specific permission assignments.
import { EmployeePermission } from '../models/employeePermission.model';
import { SystemEntity } from '../models/systemEntity.model';
import { HttpError } from '../utils/httpError';

export interface EmployeePermissionInput {
  empId?: number;
  entityId?: number;
  adminAccess?: boolean;
  createPermission?: boolean;
  readPermission?: boolean;
  updatePermission?: boolean;
  deletePermission?: boolean;
}

const ensureRequiredFields = async (payload: EmployeePermissionInput) => {
  if (payload.empId === undefined) {
    throw new HttpError(400, 'empId is required.');
  }
  if (payload.entityId === undefined) {
    throw new HttpError(400, 'entityId is required.');
  }

  const entity = await SystemEntity.findByPk(payload.entityId);
  if (!entity) {
    throw new HttpError(404, 'Referenced system entity not found.');
  }
};

export const createEmployeePermission = async (payload: EmployeePermissionInput): Promise<EmployeePermission> => {
  await ensureRequiredFields(payload);

  const existing = await EmployeePermission.findOne({
    where: {
      empId: payload.empId,
      entityId: payload.entityId,
    },
  });

  if (existing) {
    throw new HttpError(409, 'Permissions for this employee and entity already exist.');
  }

  return EmployeePermission.create({
    empId: payload.empId!,
    entityId: payload.entityId!,
    adminAccess: payload.adminAccess ?? false,
    createPermission: payload.createPermission ?? false,
    readPermission: payload.readPermission ?? true,
    updatePermission: payload.updatePermission ?? false,
    deletePermission: payload.deletePermission ?? false,
  });
};

export const listEmployeePermissions = async (): Promise<EmployeePermission[]> => {
  return EmployeePermission.findAll({ include: [{ model: SystemEntity, as: 'entity' }] });
};

export const getEmployeePermissionById = async (id: number): Promise<EmployeePermission> => {
  const record = await EmployeePermission.findByPk(id, { include: [{ model: SystemEntity, as: 'entity' }] });
  if (!record) {
    throw new HttpError(404, 'Employee permission not found.');
  }
  return record;
};

export const updateEmployeePermission = async (
  id: number,
  payload: EmployeePermissionInput
): Promise<EmployeePermission> => {
  const record = await getEmployeePermissionById(id);

  if (payload.entityId !== undefined && payload.entityId !== record.entityId) {
    await ensureRequiredFields({ ...payload, empId: record.empId });
  }

  await record.update({
    empId: payload.empId ?? record.empId,
    entityId: payload.entityId ?? record.entityId,
    adminAccess: payload.adminAccess ?? record.adminAccess,
    createPermission: payload.createPermission ?? record.createPermission,
    readPermission: payload.readPermission ?? record.readPermission,
    updatePermission: payload.updatePermission ?? record.updatePermission,
    deletePermission: payload.deletePermission ?? record.deletePermission,
  });

  return record;
};

export const deleteEmployeePermission = async (id: number): Promise<void> => {
  const record = await getEmployeePermissionById(id);
  await record.destroy();
};
