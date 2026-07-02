const mysql = require("mysql2/promise");
const { createUsersTable } = require("./initDatabase");

let pool;

const createPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "supermarket_db",
      port: Number(process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

const getPool = () => createPool();

const initDatabase = async () => {
  await createUsersTable();
};

module.exports = {
  createPool,
  getPool,
  initDatabase,
};
