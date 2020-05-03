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
            },
            headers: { 
                Referer: 'https://www.americanas.com.br/busca/coqueteleira?conteudo=coqueteleira&filtro=%5B%7B%22id%22%3A%22wit%22%2C%22value%22%3A%22Agasalho%22%2C%22fixed%22%3Afalse%7D%5D&ordenacao=higherPrice&origem=nanook&suggestion=true',
                'Sec-Fetch-Dest' : 'empty',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Mobile Safari/537.36'
            }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error);
        });
    }
}

module.exports = new ProductService();