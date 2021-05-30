

const wrapper = require('../../utils/wrapper');
const connect = require('./connection');
const validate = require('validate.js');

class DB {
  constructor(config) {
    this.config = config;
  }

  async insertOne(statement, escape = null) {

    let pool = await connect.getConnection(this.config);
    if (validate.isEmpty(pool)) {
      pool = await connect.createConnectionPool(this.config);
    }
    const recordset = () => {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            let errorMessage;
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
              errorMessage = 'Database connection was closed.';
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
              errorMessage = 'Database has too many connections.';
            }
            if (err.code === 'ECONNREFUSED') {
              errorMessage = 'Database connection was refused.';
            }
            connection.release();
            return reject(wrapper.error(err.code, errorMessage, 500));
          }
          connection.query(statement, escape, (err, result) => {
            if (err) {
              connection.release();
              return reject(wrapper.error(err.code, err.sqlMessage, 500));
            }
            connection.release();
            return resolve(wrapper.data(result));
          });
        });
      });
    };
    const result = await recordset().then(result => {
      return wrapper.data(result.data);
    }).catch(err => {
      return err;
    });
    return result;
  }

  async findData(statement, escape = null) {
    let pool = await connect.getConnection(this.config);
    if (validate.isEmpty(pool)) {
      pool = await connect.createConnectionPool(this.config);
    }
    const recordset = () => {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            let errorMessage;
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
              errorMessage = 'Database connection was closed.';
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
              errorMessage = 'Database has too many connections.';
            }
            if (err.code === 'ECONNREFUSED') {
              errorMessage = 'Database connection was refused.';
            }
            connection.release();
            return reject(wrapper.error(err.code, errorMessage, 500));
          }

          connection.query(statement, escape, (err, result) => {
            if (err) {
              connection.release();
              return reject(wrapper.error(err.code, err.sqlMessage, 500));
            }

            connection.release();
            return resolve(wrapper.data(result));

          });

        });
      });
    };
    const result = await recordset().then(result => {
      return wrapper.data(result.data);
    }).catch(err => {
      return err;
    });
    return result;
  }
}
module.exports = DB;
