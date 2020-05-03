import client from '../clients/db';

export const insertUser = (payment) => {
    client.query(`INSERT INTO payment(card_number, security_code, card_name, expiration_month, expiration_year)VALUES('${payment.card_number}', '${payment.security_code}', '${payment.card_name}', '${payment.expiration_month}', '${payment.expiration_year}')`, function (err, result) {
        if (err) {
            console.log(err);
        }
        return result;
    });
}

export const searchUser = (userId) => {
    client.query('SELECT * FROM payment where id = ' + userId, function (err, result) {
        if (err) {
            console.log(err);
        }
        return result;
    });
}

export const searchUsers = () => {
    client.query('SELECT * FROM payment', function (err, result) {
        if (err) {
            console.log(err);
        }
        return result;
    });
}