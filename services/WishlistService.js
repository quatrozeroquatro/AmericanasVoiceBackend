const client = require('../clients/db');
const user = require('../public/mockUser.json');

// mockei o usuário em viés de protótipo

function WishlistException(message) {
    this.message = message;
    this.name = "WishlistException";
 }

class WishlistService {
    insertProduct(product) {
        return client.query(`INSERT INTO wishlist(user_id, product_id, product_info)VALUES($1, $2, $3)`, [user.id, product.id, product]);
    }

    listWishlist() {
        return client.query(`SELECT * FROM wishlist WHERE user_id = $1`, [user.id]);
    }

    clearWishlist() {
        return client.query(`DELETE FROM wishlist WHERE user_id = $1`, [user.id]);
    }

    removeItem(name) {
        return client.query(`DELETE FROM wishlist WHERE user_id = $1 and product_info->>'name' LIKE $2`, [user.id, '%' + name + '%']);
    }
}

module.exports = new WishlistService();