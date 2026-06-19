const mysql = require("mysql2/promise");
const { config, validateDatabaseConfig } = require("./config");

validateDatabaseConfig();

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: true,
  connectionLimit: config.database.connectionLimit,
  queueLimit: 0,
  dateStrings: true,
  decimalNumbers: true,
  enableKeepAlive: true
});

module.exports = pool;
