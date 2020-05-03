import client from '../clients/db';

export const insertUser = (user) => {
    client.query(`INSERT INTO student(name, cpf)VALUES('${user.name}', '${user.cpf}')`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        return result;
    });
}

export const searchUser = (userId) => {
    client.query('SELECT * FROM users where id = ' + userId, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        return result;
    });
}

export const searchUsers = () => {
    client.query('SELECT * FROM users', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        return result;
    });
}