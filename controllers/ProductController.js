const ProductService = require('../services/ProductService');

class ProductController {
    async searchProduct(req, res)     {
        const { product } = req.params;
        const response = await ProductService.searchProductsV1Service(product);

        const newResponse = Promise.all(response.map(item => await ProductService.searchProductsV1Service(item.id)))
            .then(secondResponse => {
                return secondResponse;
            });
        console.log(newResponse);
        return res.json(newResponse);
    }
}

module.exports = new ProductController();