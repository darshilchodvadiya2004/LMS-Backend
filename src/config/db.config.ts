// Configures the Sequelize instance and exposes helpers for connecting and syncing the database.
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
  throw new Error('Database configuration is missing required environment variables.');
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD ?? '', {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'postgres',
  logging: false,
});

// Verifies the connection credentials before the application starts handling requests.
export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Failed to authenticate database connection:', error);
    throw error;
  }
};

// Synchronises all registered models with the underlying database in development scenarios.
export const syncDatabase = async (): Promise<void> => {
  try {
    await sequelize.sync();
    console.log('Database synchronisation completed.');
  } catch (error) {
    console.error('Database synchronisation failed:', error);
    throw error;
  }
};
