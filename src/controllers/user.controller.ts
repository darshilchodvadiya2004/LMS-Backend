// Handles user CRUD HTTP requests by delegating to the user service layer.
import { Response } from 'express';
import type { PermissionAttributes } from '../models/permission.model';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as userService from '../services/user.service';
import { HttpError } from '../utils/httpError';

const hasPermission = (req: AuthenticatedRequest, permission: string): boolean => {
  const permissions = (req.user?.role?.permissions ?? []) as PermissionAttributes[];
  return permissions.some((item) => `${item.module}:${item.action}` === permission);
};

export const getUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json({
      message: 'Users fetched successfully.',
      data: users,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid user identifier.');
    }

    const user = await userService.findUserById(id);
    if (!user) {
      throw new HttpError(404, 'User not found.');
    }

    res.status(200).json({
      message: 'User fetched successfully.',
      data: user,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid user identifier.');
    }

    const updates = req.body;

    if (req.user?.id === id && updates.roleId && !hasPermission(req, 'users:update')) {
      throw new HttpError(403, 'You are not allowed to change your own role.');
    }

    const updatedUser = await userService.updateUser(id, updates);
    res.status(200).json({
      message: 'User updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid user identifier.');
    }

    await userService.deleteUser(id);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};
