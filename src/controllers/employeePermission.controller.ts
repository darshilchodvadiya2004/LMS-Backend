// Handles HTTP endpoints for managing employee-level permissions.
import { Request, Response } from 'express';
import * as employeePermissionService from '../services/employeePermission.service';
import { HttpError } from '../utils/httpError';

export const createEmployeePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const permission = await employeePermissionService.createEmployeePermission(req.body);
    res.status(201).json({
      message: 'Employee permission created successfully.',
      data: permission,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getEmployeePermissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const permissions = await employeePermissionService.listEmployeePermissions();
    res.status(200).json({
      message: 'Employee permissions fetched successfully.',
      data: permissions,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const updateEmployeePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid employee permission identifier.');
    }

    const permission = await employeePermissionService.updateEmployeePermission(id, req.body);
    res.status(200).json({
      message: 'Employee permission updated successfully.',
      data: permission,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const deleteEmployeePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid employee permission identifier.');
    }

    await employeePermissionService.deleteEmployeePermission(id);
    res.status(200).json({ message: 'Employee permission deleted successfully.' });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};
