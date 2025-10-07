// Sequelize CLI configuration mapping environments to the shared database credentials.
require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
  throw new Error('Database environment variables must be defined before running Sequelize CLI commands.');
}

const baseConfig = {
  username: DB_USER,
  password: DB_PASSWORD || null,
  database: DB_NAME,
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'postgres',
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};
