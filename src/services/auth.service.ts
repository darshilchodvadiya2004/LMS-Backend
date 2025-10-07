// Encapsulates authentication workflows for signup and login operations.
import { Includeable, Op } from "sequelize";
import { Role, User } from "../models";
import { hashPassword, comparePassword } from "../utils/bcrypt.util";
import { signToken } from "../utils/jwt.util";
import { HttpError } from "../utils/httpError";
import {
  roleWithPermissionsInclude,
  sanitizeUser,
  UserResponse,
} from "./user.service";

interface SignupInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  roleName?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: UserResponse;
}

const includeRoleWithPermissions: Includeable[] = [roleWithPermissionsInclude];

export const signup = async (payload: SignupInput): Promise<AuthResponse> => {
  const roleName = payload.roleName ?? "Employee";
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new HttpError(400, "Invalid role specified for signup.");
  }

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email: payload.email }, { username: payload.username }],
    },
  });

  if (existingUser) {
    throw new HttpError(
      409,
      "User already exists with the provided email or username."
    );
  }

  const hashedPassword = await hashPassword(payload.password);
  const createdUser = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
    roleId: role.id,
  });

  const userWithRelations = await User.findByPk(createdUser.id, {
    include: includeRoleWithPermissions,
  });

  if (!userWithRelations) {
    throw new HttpError(500, "Unable to load user after creation.");
  }

  const token = signToken({
    userId: userWithRelations.id,
    roleId: userWithRelations.roleId,
  });

  return {
    token,
    user: sanitizeUser(userWithRelations),
  };
};

export const login = async ({
  email,
  password,
}: LoginInput): Promise<AuthResponse> => {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: email }, { username: email }],
    },
    include: includeRoleWithPermissions,
  });

  if (!user) {
    throw new HttpError(401, "Invalid credentials.");
  }

  const matches = await comparePassword(password, user.password);
  if (!matches) {
    throw new HttpError(401, "Invalid credentials.");
  }

  const token = signToken({ userId: user.id, roleId: user.roleId });

  return {
    token,
    user: sanitizeUser(user),
  };
};
