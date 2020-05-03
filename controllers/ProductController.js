const ProductService = require('../services/ProductService');

class ProductController {
    async searchProduct(req, res)     {
        const { product } = req.params;
        const response = await ProductService.searchProductsV1Service(product)
            .then(items =>
                items.map(item => await ProductService.searchProductsV2Service(item.id).then(secondResponse => {
                    const product = {
                        image: secondResponse.data.product.result.images[0].medium,
                        name: secondResponse.data.product.result.name,
                        price: secondResponse.data.offer.result.offers[0].salesPrice,
                        store: secondResponse.data.offer.result.offers[0]._embedded.seller.name
                    }
                    return product;
                })));
        
        console.log(response);
        return res.json(response);
    }
}

module.exports = new ProductController();