const mysql = require("mysql2/promise");
const { getPool } = require("./db");

const createCategoryTable = async () => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id CHAR(36) NOT NULL UNIQUE,
        catId VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        subcategory JSON DEFAULT NULL,
        images JSON DEFAULT NULL,
        show_in_navbar TINYINT(1) DEFAULT 0,
        created_by VARCHAR(36) DEFAULT NULL,
        updated_by VARCHAR(36) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
  } finally {
    connection.release();
  }
};

module.exports = {
  createCategoryTable,
};
