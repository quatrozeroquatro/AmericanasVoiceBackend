const express = require('express');
const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client({
    connectionString: connectionString
});
client.connect();
var app = express();
app.set('port', process.env.PORT || 4000);
app.get('/', function (req, res, next) {
    client.query('SELECT * FROM users', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
});
app.listen(process.env.PORT, function () {
    console.log('Server is running.. on Port '+ process.env.PORT);
});