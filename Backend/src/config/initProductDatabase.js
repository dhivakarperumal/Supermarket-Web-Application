const mysql = require("mysql2/promise");
const { createPool } = require("./db");

const createProductTable = async () => {
  const pool = createPool();
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id CHAR(36) UNIQUE,
        name VARCHAR(255) NOT NULL,
        product_code VARCHAR(100),
        barcode VARCHAR(100),
        barcode_image LONGTEXT,
        category VARCHAR(100),
        category_id INT DEFAULT NULL,
        subcategory VARCHAR(100),
        brand VARCHAR(100),
        description TEXT,
        mrp DECIMAL(10,2) DEFAULT 0,
        selling_price DECIMAL(10,2) DEFAULT 0,
        offer DECIMAL(5,2) DEFAULT 0,
        offer_price DECIMAL(10,2) DEFAULT 0,
        stock_quantity DECIMAL(10,3) DEFAULT 0,
        pricing_options JSON,
        total_stock DECIMAL(10,3) DEFAULT 0,
        expiry_date VARCHAR(50),
        manufacturing_date VARCHAR(50),
        country_of_origin VARCHAR(100),
        supplier VARCHAR(100),
        product_images JSON,
        thumbnail_image LONGTEXT,
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        featured_product BOOLEAN DEFAULT FALSE,
        best_seller BOOLEAN DEFAULT FALSE,
        todays_deal BOOLEAN DEFAULT FALSE,
        delivery_time VARCHAR(100),
        return_available BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3,2) DEFAULT 5,
        review_count INT DEFAULT 0,
        combo_items JSON,
        type INT DEFAULT 0,
        created_by CHAR(36) DEFAULT NULL,
        updated_by CHAR(36) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    // Add combo_items to existing table if it doesn't exist
    try {
      await connection.query("ALTER TABLE products ADD COLUMN combo_items JSON");
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        console.error("Error altering table combo_items:", err);
      }
    }

    // Ensure stock columns exist and support decimal values for kg/g/L/ml
    try {
      const stockColumns = ["stock_quantity", "total_stock"];
      for (const columnName of stockColumns) {
        const [existingColumns] = await connection.query(
          `SELECT COLUMN_NAME
           FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_SCHEMA = DATABASE()
             AND TABLE_NAME = 'products'
             AND COLUMN_NAME = ?`,
          [columnName]
        );

        if (existingColumns.length === 0) {
          await connection.query(`ALTER TABLE products ADD COLUMN ${columnName} DECIMAL(10,3) DEFAULT 0`);
        } else {
          await connection.query(`ALTER TABLE products MODIFY COLUMN ${columnName} DECIMAL(10,3) DEFAULT 0`);
        }
      }
    } catch (err) {
      console.error("Error ensuring stock columns:", err);
    }

    // Add category_id column if it doesn't exist (safe migration)
    try {
      await connection.query(`
        ALTER TABLE products ADD COLUMN category_id INT DEFAULT NULL
      `);
    } catch (e) {
      // Column may already exist
    }

    const alterColumns = [
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS type INT DEFAULT 0",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS product_id CHAR(36) UNIQUE",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by CHAR(36) DEFAULT NULL",
      "ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by CHAR(36) DEFAULT NULL"
    ];
    for (const sql of alterColumns) {
      try { await connection.query(sql); } catch (e) { /* ignore if exists */ }
    }

    // Add foreign key constraint if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE products ADD CONSTRAINT fk_product_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      `);
    } catch (e) {
      // Constraint may already exist
    }
  } finally {
    connection.release();
  }
};

module.exports = {
  createProductTable,
};
