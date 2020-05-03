const { Client } = require('pg');

var connectionString = process.env.DATABASE_URL;

module.exports = new Client({
    connectionString: connectionString
});