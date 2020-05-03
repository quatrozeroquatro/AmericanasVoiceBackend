const routes = require('express').Router();

const ProductController = require('./controllers/ProductController');

routes.get('/search/:product', ProductController.searchProduct);

routes.post('/add', ProductController.addProduct);

routes.get('/list', ProductController.listWishlist);

module.exports = routes;