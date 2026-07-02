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
      enableKeepAlive: true,
      maxIdle: 10,
      idleTimeout: 60000,
      bigNumberStrings: true,
      supportBigNumbers: true,
      connectionAttributes: false
    });
    
    console.log("📋 Database pool created. Make sure MySQL max_allowed_packet is set to at least 256MB");
    console.log("   See: https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_max_allowed_packet");
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
