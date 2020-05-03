const ProductService = require('../services/ProductService');

class ProductController {
    async searchProduct(req, res)     {
        const { product } = req.params;
        const products = await ProductService.searchProductsV1Service(product);
        const productsDetails = await Promise.all(products.map(item => ProductService.searchProductsV2Service(item.id)));

        response = productsDetails.map(item => {
            const product = {
                image: item.product.result.images[0].medium,
                name: item.product.result.name,
                price: item.offer.result.offers[0].salesPrice,
                store: item.offer.result.offers[0]._embedded.seller.name
            }
            return product;
        })

        console.log(response);
        return res.json(response);
    }
}

module.exports = new ProductController();