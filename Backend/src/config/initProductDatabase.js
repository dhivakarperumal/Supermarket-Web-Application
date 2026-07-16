const mysql = require("mysql2/promise");
const { getPool } = require("./db");

const createProductTable = async () => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id CHAR(36) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        product_code VARCHAR(100) DEFAULT NULL,
        barcode VARCHAR(100) DEFAULT NULL,
        barcode_image TEXT DEFAULT NULL,
        category VARCHAR(255) DEFAULT NULL,
        category_id INT DEFAULT NULL,
        subcategory JSON DEFAULT NULL,
        brand VARCHAR(255) DEFAULT NULL,
        description TEXT DEFAULT NULL,
        mrp DECIMAL(12,2) DEFAULT 0,
        selling_price DECIMAL(12,2) DEFAULT 0,
        offer DECIMAL(12,2) DEFAULT 0,
        offer_price DECIMAL(12,2) DEFAULT 0,
        stock_quantity INT DEFAULT 0,
        pricing_options JSON DEFAULT NULL,
        total_stock INT DEFAULT 0,
        expiry_date DATE DEFAULT NULL,
        manufacturing_date DATE DEFAULT NULL,
        country_of_origin VARCHAR(100) DEFAULT NULL,
        supplier VARCHAR(255) DEFAULT NULL,
        product_images JSON DEFAULT NULL,
        thumbnail_image TEXT DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        featured_product TINYINT(1) DEFAULT 0,
        best_seller TINYINT(1) DEFAULT 0,
        todays_deal TINYINT(1) DEFAULT 0,
        delivery_time VARCHAR(255) DEFAULT NULL,
        return_available TINYINT(1) DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 5,
        review_count INT DEFAULT 0,
        combo_items JSON DEFAULT NULL,
        type VARCHAR(50) DEFAULT NULL,
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
  createProductTable,
};
