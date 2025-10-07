// Handles endpoints for querying roles and permissions metadata.
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Permission, Role } from '../models';
import type { PermissionAttributes } from '../models/permission.model';
import type { RoleAttributes } from '../models/role.model';
import { HttpError } from '../utils/httpError';

const formatPermission = (permission: PermissionAttributes): string => `${permission.module}:${permission.action}`;

export const getRoles = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
        },
      ],
    });

    const payload = roles.map((roleInstance) => {
      const plain = roleInstance.get({ plain: true }) as RoleAttributes & {
        permissions?: PermissionAttributes[];
      };

      const { permissions, ...roleRest } = plain;
      return {
        ...roleRest,
        permissions: permissions?.map((permission) => formatPermission(permission)) ?? [],
      };
    });

    res.status(200).json({
      message: 'Roles fetched successfully.',
      data: payload,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getPermissions = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const permissions = await Permission.findAll({ include: [{ model: Role, as: 'rolesWithAccess', through: { attributes: [] } }] });
    res.status(200).json({
      message: 'Permissions fetched successfully.',
      data: permissions.map((permission) => permission.get({ plain: true })),
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};
