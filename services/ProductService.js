const axios = require('axios');

class ProductService {
    searchProductsV1Service(productName) {

        return axios.get(process.env.APIV1, {
            params:{
                content: productName,
                sortBy: 'lowerPrice',
                source: 'nanook',
                limit: 2
            }
        }).then(response => {
            return response.data.products;
        }).catch(error => {
            console.log(error);
        });
    }

    searchProductsV2Service(id) {
        return axios.get(process.env.APIV2, {
            params:{
                id: id
            }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error);
        });
    }
}

module.exports = new ProductService();