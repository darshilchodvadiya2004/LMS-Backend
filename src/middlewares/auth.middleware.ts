// Middleware validating JWT tokens and attaching the authenticated user to the request object.
import { NextFunction, Request, Response } from 'express';
import { Permission, Role, User } from '../models';
import { HttpError } from '../utils/httpError';
import { verifyToken } from '../utils/jwt.util';

export interface AuthenticatedRequest extends Request {
  user?: User & {
    role?: Role & {
      permissions?: Permission[];
    };
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpError(401, 'Authorization token missing.');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const payload = verifyToken(token);

    const user = await User.findByPk(payload.userId, {
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: Permission,
              as: 'permissions',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) {
      throw new HttpError(401, 'User referenced by token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 401;
    res.status(status).json({ message: (error as Error).message });
  }
};
