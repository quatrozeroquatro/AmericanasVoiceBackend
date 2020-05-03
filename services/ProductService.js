const AmericanasClient = require('../clients/AmericanasClient');

export const searchProductsV1Service = (productName) => {
    return AmericanasClient.APIV1.get('/search', {
        params:{
            content: productName,
            sortBy: 'lowerPrice',
            source: 'nanoo',
            limit: 2
        }
    }).then(({data}) => {
        return data.products
    })
 }

export const searchProductsV2Service = (id) => {
    return AmericanasClient.APIV2.get('/2', {
        params:{
            id
        }
    }).then(({data}) => {
        return data.products
    })
 }
