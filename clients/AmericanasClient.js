const axios = require('axios');

export var API1 = axios.create({
    baseURL: process.env.API_V1,
    timeout: 15000
});

export var API2 = axios.create({
    baseURL: process.env.API_V2,
    timeout: 15000
});