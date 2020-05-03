const pool = require('./pool');

class Client {

  query(quertText, params) {
    return new Promise((resolve, reject) => {
      pool.query(quertText, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = new Client();