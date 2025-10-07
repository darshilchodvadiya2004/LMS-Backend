// Provides reusable business logic for user retrieval, updates, and deletion.
import { Includeable, Op } from 'sequelize';
import { Permission, Role, User } from '../models';
import type { PermissionAttributes } from '../models/permission.model';
import type { RoleAttributes } from '../models/role.model';
import type { UserAttributes } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/bcrypt.util';
import { HttpError } from '../utils/httpError';

export const roleWithPermissionsInclude: Includeable = {
  model: Role,
  as: 'role',
  include: [
    {
      model: Permission,
      as: 'permissions',
      through: { attributes: [] },
    },
  ],
};

type PlainPermission = PermissionAttributes;
type PlainRole = RoleAttributes & { permissions?: PlainPermission[] };
type PlainUser = UserAttributes & { role?: PlainRole };

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roleId: number;
  createdAt?: Date;
  updatedAt?: Date;
  role?: {
    id: number;
    name: string;
    description: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    permissions?: string[];
  };
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  roleId?: number;
}

export const normalizePermission = (permission: PlainPermission): string => {
  return `${permission.module}:${permission.action}`;
};

export const sanitizeUser = (user: User): UserResponse => {
  const plain = user.get({ plain: true }) as PlainUser;
  const { password, role, ...rest } = plain;

  let formattedRole: UserResponse['role'];
  if (role) {
    const { permissions, ...roleRest } = role;
    formattedRole = {
      ...roleRest,
      permissions: permissions?.map((permission) => normalizePermission(permission)) ?? [],
    };
  }

  return {
    ...rest,
    role: formattedRole,
  };
};

export const findAllUsers = async (): Promise<UserResponse[]> => {
  const users = await User.findAll({ include: [roleWithPermissionsInclude] });
  return users.map(sanitizeUser);
};

export const findUserById = async (id: number): Promise<UserResponse | null> => {
  const user = await User.findByPk(id, { include: [roleWithPermissionsInclude] });
  return user ? sanitizeUser(user) : null;
};

export const updateUser = async (id: number, updates: UpdateUserInput): Promise<UserResponse> => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new HttpError(404, 'User not found.');
  }

  if (updates.email) {
    const existingEmail = await User.findOne({
      where: {
        email: updates.email,
        id: { [Op.ne]: id },
      },
    });

    if (existingEmail) {
      throw new HttpError(409, 'Email already in use.');
    }
  }

  if (updates.username) {
    const existingUsername = await User.findOne({
      where: {
        username: updates.username,
        id: { [Op.ne]: id },
      },
    });

    if (existingUsername) {
      throw new HttpError(409, 'Username already in use.');
    }
  }

  if (updates.password) {
    const isSamePassword = await comparePassword(updates.password, user.password);
    updates.password = isSamePassword ? user.password : await hashPassword(updates.password);
  }

  await user.update(updates);

  const reloaded = await User.findByPk(id, { include: [roleWithPermissionsInclude] });
  if (!reloaded) {
    throw new HttpError(500, 'Unable to load user after update.');
  }

  return sanitizeUser(reloaded);
};

export const deleteUser = async (id: number): Promise<void> => {
  const deleted = await User.destroy({ where: { id } });
  if (!deleted) {
    throw new HttpError(404, 'User not found.');
  }
};
