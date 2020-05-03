const routes = require('express').Router();

const searchProduct = require('./controllers/ProductController');

routes.get('/search/:product', searchProduct);

module.exports = routes;