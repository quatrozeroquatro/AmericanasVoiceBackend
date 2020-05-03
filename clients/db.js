const { Client } = require('pg');
var connectionString = process.env.DATABASE_URL;

const client = new Client({
    connectionString: connectionString
});