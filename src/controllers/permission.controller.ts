// Handles HTTP endpoints for CRUD operations on permissions.
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { RolePermission } from '../models/rolePermission.model';
import { CRUD_ACTIONS } from '../utils/constants';
import { HttpError } from '../utils/httpError';

interface PermissionPayload {
  module?: string;
  action?: string;
  roleId?: number | null;
  roleIds?: number[];
}

const validateAction = (action?: string): 'create' | 'read' | 'update' | 'delete' => {
  if (!action || !CRUD_ACTIONS.includes(action as typeof CRUD_ACTIONS[number])) {
    throw new HttpError(400, 'Action must be one of create, read, update, or delete.');
  }
  return action as 'create' | 'read' | 'update' | 'delete';
};

const ensureRoleExists = async (roleId: number): Promise<void> => {
  const role = await Role.findByPk(roleId);
  if (!role) {
    throw new HttpError(404, `Role with id ${roleId} not found.`);
  }
};

const syncRoleAssignments = async (permissionId: number, roleIds?: number[]): Promise<void> => {
  if (!roleIds) {
    return;
  }

  await RolePermission.destroy({ where: { permissionId } });

  if (!roleIds.length) {
    return;
  }

  const uniqueRoleIds = [...new Set(roleIds)];
  await Promise.all(uniqueRoleIds.map(ensureRoleExists));

  await RolePermission.bulkCreate(
    uniqueRoleIds.map((roleId) => ({ roleId, permissionId })),
    { ignoreDuplicates: true }
  );
};

export const createPermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { module, action, roleId = null, roleIds }: PermissionPayload = req.body;

    if (!module) {
      throw new HttpError(400, 'Permission module is required.');
    }

    const normalizedAction = validateAction(action);

    if (roleId) {
      await ensureRoleExists(roleId);
    }

    const existingPermission = await Permission.findOne({
      where: {
        module,
        action: normalizedAction,
        roleId,
      },
    });

    if (existingPermission) {
      throw new HttpError(409, 'A permission with the provided module, action, and role already exists.');
    }

    const permission = await Permission.create({ module, action: normalizedAction, roleId });
    await syncRoleAssignments(permission.id, roleIds ?? (roleId ? [roleId] : undefined));

    res.status(201).json({
      message: 'Permission created successfully.',
      data: permission,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getPermissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const permissions = await Permission.findAll({ include: [{ model: Role, as: 'rolesWithAccess', through: { attributes: [] } }] });
    res.status(200).json({
      message: 'Permissions fetched successfully.',
      data: permissions,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const updatePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid permission identifier.');
    }

    const { module, action, roleId = null, roleIds }: PermissionPayload = req.body;

    const permission = await Permission.findByPk(id);
    if (!permission) {
      throw new HttpError(404, 'Permission not found.');
    }

    if (module !== undefined) {
      if (!module) {
        throw new HttpError(400, 'Permission module cannot be empty.');
      }
      permission.module = module;
    }

    if (action !== undefined) {
      permission.action = validateAction(action);
    }

    if (roleId !== undefined) {
      if (roleId) {
        await ensureRoleExists(roleId);
      }
      permission.roleId = roleId;
    }

    const duplicate = await Permission.findOne({
      where: {
        module: permission.module,
        action: permission.action,
        roleId: permission.roleId,
        id: { [Op.ne]: permission.id },
      },
    });

    if (duplicate) {
      throw new HttpError(409, 'A permission with the provided module, action, and role already exists.');
    }

    await permission.save();
    await syncRoleAssignments(permission.id, roleIds);

    res.status(200).json({
      message: 'Permission updated successfully.',
      data: permission,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const deletePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid permission identifier.');
    }

    const permission = await Permission.findByPk(id);
    if (!permission) {
      throw new HttpError(404, 'Permission not found.');
    }

    await RolePermission.destroy({ where: { permissionId: id } });
    await permission.destroy();

    res.status(200).json({ message: 'Permission deleted successfully.' });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};
