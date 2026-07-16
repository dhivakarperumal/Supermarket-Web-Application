const mysql = require("mysql2/promise");
const { createUsersTable } = require("./initDatabase");
const { initPurchaseTables } = require("../controllers/purchaseController");

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
      supportBigNumbers: true
    });
    console.log("📋 Database pool created.");
  }
  return pool;
};

const getPool = () => createPool();

/**
 * Get a connection with max_allowed_packet set to 256MB at session level.
 * Use this whenever you need to store large base64 images.
 */
const getLargePacketConnection = async () => {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    await connection.query("SET SESSION max_allowed_packet = 268435456"); // 256MB
  } catch (e) {
    // Ignore if the user doesn't have SUPER privilege — global setting handles it
  }
  return connection;
};

const initDatabase = async () => {
  await createUsersTable();
  await initPurchaseTables();
};

module.exports = {
  createPool,
  getPool,
  getLargePacketConnection,
  initDatabase,
};
