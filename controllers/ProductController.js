import AmericanasClient from '../services/ProductService';

const SearchProduct = (req, res) => {
    const { product } = req.params;
    return res.json(AmericanasClient.searchProductsV1Service(product));
}

export default SearchProduct;