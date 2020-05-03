const axios = require('axios');

class ProductService {
    searchProductsV1Service(productName) {

        return axios.get(process.env.APIV1, {
            params:{
                content: productName,
                sortBy: 'relevant',
                source: 'omega',
                limit: 2
            },
        }).then(response => {
            return response.data.products;
        }).catch(error => {
            console.log(error);
        });
    }

    // não funciona no servidor, apenas local
    // API Americanas bloqueia chamadas de servidores
    searchProductsV2Service(id) {
        return axios.get(process.env.APIV2, {
            params:{
                id: id
            },
            // tentei de tudo como podem ver kkkk
            headers: { 
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "referrer": "https://www.americanas.com.br/produto/1509599829/coqueteleira-iridium-labs?cor=Amarela&pfm_carac=coqueteleira&pfm_page=search&pfm_pos=grid&pfm_type=search_page",
                "referrerPolicy": "no-referrer-when-downgrade",
                "mode": "cors"
            }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error);
        });
    }
}

module.exports = new ProductService();