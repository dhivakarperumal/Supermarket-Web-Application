const mysql = require("mysql2/promise");
const { createPool } = require("./db");

const createCategoryTable = async () => {
  const pool = createPool();
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id CHAR(36) NOT NULL UNIQUE,
        catId VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        subcategory JSON,
        images JSON,
        show_in_navbar TINYINT(1) NOT NULL DEFAULT 1,
        created_by CHAR(36) DEFAULT NULL,
        updated_by CHAR(36) DEFAULT NULL,
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
      if (!e.message.includes("Duplicate column")) {}
    }

    // Add new columns for category_id, created_by, updated_by if they don't exist
    try {
      await connection.query("ALTER TABLE categories ADD COLUMN category_id CHAR(36) NOT NULL UNIQUE");
    } catch (e) {
      if (!e.message.includes("Duplicate column")) {}
    }
    
    try {
      await connection.query("ALTER TABLE categories ADD COLUMN created_by CHAR(36) DEFAULT NULL");
    } catch (e) {
      if (!e.message.includes("Duplicate column")) {}
    }
    
    try {
      await connection.query("ALTER TABLE categories ADD COLUMN updated_by CHAR(36) DEFAULT NULL");
    } catch (e) {
      if (!e.message.includes("Duplicate column")) {}
    }
    }
  } finally {
    connection.release();
  }
};

module.exports = {
  createCategoryTable,
};
