const routes = require('express').Router();
import searchProduct from './controllers/ProductController';

routes.get('/search/:product', searchProduct);

module.exports = routes;