const ProductService = require('../services/ProductService');

const SearchProduct = (req, res) => {
    const { product } = req.params;
    return res.json(ProductService.searchProductsV1Service(product));
}

export default SearchProduct;