const mysql = require("mysql2/promise");

const dbName = process.env.DB_NAME || "supermarket_db";

const createUsersTable = async () => {
  const adminConnection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT || 3306),
  });

  try {
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  } finally {
    await adminConnection.end();
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: dbName,
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id CHAR(36) NOT NULL UNIQUE,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) DEFAULT NULL UNIQUE,
        google_id VARCHAR(255) DEFAULT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        role ENUM('admin', 'user', 'manager', 'dealer') NOT NULL DEFAULT 'user',
        created_by CHAR(36) NOT NULL,
        updated_by CHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) DEFAULT NULL UNIQUE,
      MODIFY COLUMN phone VARCHAR(20) DEFAULT NULL UNIQUE,
      MODIFY COLUMN role ENUM('admin', 'user', 'manager', 'dealer') NOT NULL DEFAULT 'user',
      MODIFY COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active'
    `);
  } finally {
    connection.release();
    await pool.end();
  }
};

module.exports = {
  createUsersTable,
};
