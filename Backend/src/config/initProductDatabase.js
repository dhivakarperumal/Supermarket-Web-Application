const mysql = require("mysql2/promise");
const { createPool } = require("./db");

const createProductTable = async () => {
  const pool = createPool();
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        product_code VARCHAR(100),
        barcode VARCHAR(100),
        barcode_image LONGTEXT,
        category VARCHAR(100),
        subcategory VARCHAR(100),
        brand VARCHAR(100),
        description TEXT,
        mrp DECIMAL(10,2) DEFAULT 0,
        selling_price DECIMAL(10,2) DEFAULT 0,
        offer DECIMAL(5,2) DEFAULT 0,
        offer_price DECIMAL(10,2) DEFAULT 0,
        stock_quantity INT DEFAULT 0,
        pricing_options JSON,
        total_stock INT DEFAULT 0,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } finally {
    connection.release();
  }
};

module.exports = {
  createProductTable,
};
