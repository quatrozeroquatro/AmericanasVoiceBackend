const { Pool } = require('pg');

const databaseConfig = { connectionString: process.env.DATABASE_URL };

module.exports = new Pool(databaseConfig);