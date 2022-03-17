// const mysql = require("mysql2/promise"); NANTI DI UNINSTALL PACKAGENYA
const mongoose = require("mongoose");
// create the connection to database
const URL = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
const connectionStartUp = async () => {
  await mongoose.connect(URL);
};
connectionStartUp().catch((e) => console.log(e));
