const client = require('../clients/db');
const user = require('../public/mockUser.json');

// mockei o usuário em viés de protótipo

function WishlistException(message) {
    this.message = message;
    this.name = "WishlistException";
 }

class WishlistService {
    insertProduct(product) {
        const response = client.query(`INSERT INTO wishlist(user_id, product_id, product_info)VALUES($1, $2, $3)`, [user.id, product.id, product]);
        return response;
    }

    listWishlist() {
        return client.query(`SELECT * FROM wishlist WHERE user_id = $1`, [user.id]);
        console.log(JSON.stringify(response))
        const dbResponse = response.rows;
        return dbResponse;
    }
}

module.exports = new WishlistService();