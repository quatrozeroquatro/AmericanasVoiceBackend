const client = require('../clients/db');
const user = require('../public/mockUser.json');

// mockei o usuário em viés de protótipo

class WishlistService {
    insertProduct(product) {
        console.log(JSON.stringify(user));
        return client.query(`INSERT INTO wishlist(user_id, product_id, product_info)VALUES(${user.id}, ${product.id}, ${product})`);
    }

    listWishlist() {
        return client.query('SELECT * FROM users where user_id = ' + user.id);
    }
}