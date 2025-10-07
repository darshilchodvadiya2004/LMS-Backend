// Provides helper functions for signing and verifying JSON Web Tokens used for authentication.
import dotenv from 'dotenv';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET;
const defaultExpiresIn = process.env.JWT_EXPIRES_IN ?? '1h';

if (!secret) {
  throw new Error('JWT_SECRET environment variable must be defined.');
}

const jwtSecret: Secret = secret;
const defaultOptions: SignOptions = { expiresIn: defaultExpiresIn as SignOptions['expiresIn'] };

export interface JwtPayload {
  userId: number;
  roleId: number;
}

export const signToken = (payload: JwtPayload, options?: SignOptions): string => {
  const mergedOptions = { ...defaultOptions, ...(options ?? {}) };
  return jwt.sign(payload, jwtSecret, mergedOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};
