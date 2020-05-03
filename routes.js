const routes = require('express').Router();

const ProductController = require('./controllers/ProductController');

routes.get('/search/:product', ProductController.searchProduct);

module.exports = routes;