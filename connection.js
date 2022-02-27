const mysql = require("mysql2/promise");

// create the connection to database
const connectionStartUp = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "travelist",
  });
  return connection;
};

module.exports = connectionStartUp;
