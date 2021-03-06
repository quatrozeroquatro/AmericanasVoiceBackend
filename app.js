const express = require('express');
const routes = require('./routes');
require('dotenv').config();

var app = express();

app.use(express.json());
app.use(routes);

app.set('port', process.env.PORT || 4000);

app.listen(process.env.PORT, function () {
    console.log('Server is running.. on Port '+ (process.env.PORT || 4000));
});