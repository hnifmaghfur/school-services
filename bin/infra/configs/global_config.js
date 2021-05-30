require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  privateKey: process.env.PRIVATE_KEY_PATH,
  mongoDbUrl: process.env.MONGO_DATABASE_URL,
  mysqlConfig: {
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
