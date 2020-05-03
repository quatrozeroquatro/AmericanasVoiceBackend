const axios = require('axios');

class ProductService {
    searchProductsV1Service(productName) {

        axios.get(process.env.APIV1, {
            params:{
                content: productName,
                sortBy: 'lowerPrice',
                source: 'nanook',
                limit: 2
            }
        }).then(response => {
            console.log(response.data);
            return response.data.products;
        }).catch(error => {
            console.log(error);
        });
    }

    searchProductsV2Service(id) {
        axios.get(process.env.APIV2, {
            params:{
                id
            }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error);
        });
    }
}

module.exports = new ProductService();