const mysql = require("mysql2/promise");
const { createPool } = require("./db");

const createCategoryTable = async () => {
  const pool = createPool();
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        catId VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        subcategory JSON,
        images JSON,
        show_in_navbar TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add column to existing tables that were created before this migration
    try {
      await connection.query(
        "ALTER TABLE categories ADD COLUMN show_in_navbar TINYINT(1) NOT NULL DEFAULT 1"
      );
    } catch (e) {
      // Column already exists — safe to ignore
      if (!e.message.includes("Duplicate column")) {
        // Only log truly unexpected errors
        // console.warn("show_in_navbar alter:", e.message);
      }
    }
  } finally {
    connection.release();
  }
};

module.exports = {
  createCategoryTable,
};
