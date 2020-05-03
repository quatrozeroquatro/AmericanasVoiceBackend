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
        console.log(`INSERT INTO wishlist(user_id, product_id, product_info)VALUES(${user.id}, ${product.id}, ${product})`);
        const response = client.query(`INSERT INTO wishlist(user_id, product_id, product_info)VALUES(${user.id}, ${product.id}, '${product}')`);
        const dbResponse = response.rows[0];
        if (!dbResponse) {
            error = 'Operation not completed';
            throw new WishlistException(error);
        }
        return dbResponse;
    }

    listWishlist() {
        const response = client.query(`SELECT * FROM wishlist WHERE user_id = ${user.id}`);
        const dbResponse = response.rows[0];
        if (!dbResponse) {
            error = 'Operation not completed';
            throw new WishlistException(error);
        }
        return dbResponse;
    }
}

module.exports = new WishlistService();