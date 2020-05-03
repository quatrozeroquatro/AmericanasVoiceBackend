const ProductService = require('../services/ProductService');

class ProductController {
    searchProduct(req, res)     {
        const { product } = req.params;
        return res.json(ProductService.searchProductsV1Service(product));
    }
}

module.exports = new ProductController();