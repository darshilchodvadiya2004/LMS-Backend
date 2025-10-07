// Middleware enforcing permission-based access control for protected routes.
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { HttpError } from '../utils/httpError';

const stringifiedPermissions = (req: AuthenticatedRequest): Set<string> => {
  const permissions = req.user?.role?.permissions ?? [];
  return new Set(
    permissions.map((permission) => `${permission.module}:${permission.action}`)
  );
};

export const authorizePermissions = (requiredPermissions: string[]) => (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Authentication required.');
    }

    const permissionNames = stringifiedPermissions(req);
    const hasAllPermissions = requiredPermissions.every((permission) => permissionNames.has(permission));

    if (!hasAllPermissions) {
      throw new HttpError(403, 'You do not have the required permissions.');
    }

    next();
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 403;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const authorizeSelfOrPermissions = (requiredPermissions: string[]) => (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Authentication required.');
    }

    const targetId = Number(req.params.id);
    if (Number.isNaN(targetId)) {
      throw new HttpError(400, 'Invalid user identifier.');
    }

    if (req.user.id === targetId) {
      next();
      return;
    }

    authorizePermissions(requiredPermissions)(req, res, next);
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 403;
    res.status(status).json({ message: (error as Error).message });
  }
};
