const ProductService = require('../services/ProductService');

class ProductController {
    async searchProduct(req, res)     {
        const { product } = req.params;
        const response = await ProductService.searchProductsV1Service(product);

        const newResponse = await Promise.all(
            response.map(item => ProductService.searchProductsV2Service(item.id)))
            .then(secondResponse => {
                return secondResponse;
            });
        console.log(newResponse);
        return res.json(newResponse);
    }
}

module.exports = new ProductController();