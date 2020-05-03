const ProductService = require('../services/ProductService');

class ProductController {
    async searchProduct(req, res)     {
        const { product } = req.params;
        const response = await ProductService.searchProductsV1Service(product);
        return res.json(response);
    }
}

module.exports = new ProductController();