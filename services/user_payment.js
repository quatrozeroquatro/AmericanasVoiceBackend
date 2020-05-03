import client from '../clients/db';

export const insertUserPayment = (userId, paymentId) => {
    client.query(`INSERT INTO user_payment(user_id, payment_id)VALUES('${userId}', '${paymentId}')`, function (err, result) {
        if (err) {
            console.log(err);
        }
        return result;
    });
}

export const searchtUserPayment = (userId) => {
    client.query('SELECT * FROM user_payment where id = ' + userId, function (err, result) {
        if (err) {
            console.log(err);
        }
        return result;
    });
}

export const searchUserPayment = () => {
    client.query('SELECT * FROM user_payment', function (err, result) {
        if (err) {
            console.log(err);
        }
        return result;
    });
}