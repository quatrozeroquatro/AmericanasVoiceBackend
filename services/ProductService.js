import APIV1 from '../clients/americanas';
import APIV2 from '../clients/americanas';

export const SearchProductsV1Service = (productName) => {
    return APIV1.get('/search', {
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

 export const SearchProductsV2Service = (id) => {
    return APIV2.get('/2', {
        params:{
            id
        }
    }).then(({data}) => {
        return data.products
    })
 }

