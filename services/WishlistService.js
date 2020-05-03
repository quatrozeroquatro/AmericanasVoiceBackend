const client = require('../clients/db');
const user = require('../public/mockUser.json');

// mockei o usuário em viés de protótipo

function WishlistException(message) {
    this.message = message;
    this.name = "WishlistException";
 }

class WishlistService {
    insertProduct(product) {
        console.log(JSON.stringify(product));
        const response = client.query(`INSERT INTO wishlist(user_id, product_id, product_info)VALUES($1, $2, $3)`, [user.id, product.id, product]);
        return response;
    }

    listWishlist() {
        const response = client.query(`SELECT * FROM wishlist WHERE user_id = $1`, user.id);
        const dbResponse = response.rows[0];
        return dbResponse;
    }
}

module.exports = new WishlistService();