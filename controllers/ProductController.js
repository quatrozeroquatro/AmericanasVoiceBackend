import { SearchProductsV1Service, SearchProductsV2Service } from '../services/ProductService';

const SearchProduct = (req, res) => {
    const { product } = req.params;
    return res.json(SearchProductsV1Service(product));
}

export default SearchProduct;