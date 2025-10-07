// Supplies password hashing and comparison utilities built on top of bcrypt.
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
