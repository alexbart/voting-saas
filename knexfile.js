// knexfile.js
const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'voting_saas',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'admin',
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'db', 'migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'db', 'seeds'),
    },
  },

  // Add other environments if needed (staging, production)
};