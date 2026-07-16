const mysql = require("mysql2/promise");
const { getPool } = require("./db");
const { initPurchaseTables } = require("../controllers/purchaseController");

const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.DB_DATABASE || "supermarket_db";
const shouldCreateDatabase = process.env.DB_ALLOW_DB_CREATE === "true";

const getDbConfig = () => ({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT || 3306),
  database: dbName,
});

const createUsersTable = async () => {
  if (!dbName) {
    throw new Error("DB_NAME is required. Please set DB_NAME in your environment.");
  }

  const { host, user, password, port } = getDbConfig();

  if (shouldCreateDatabase) {
    const adminConnection = await mysql.createConnection({
      host,
      user,
      password,
      port,
    });

    try {
      await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      try {
        await adminConnection.query(`SET GLOBAL max_allowed_packet = 268435456`);
      } catch (e) {
        console.warn("⚠️ Could not set GLOBAL max_allowed_packet, continue without it:", e?.message || e);
      }
    } finally {
      await adminConnection.end();
    }
  } else {
    console.log("Skipping database creation. Ensure the database already exists in cPanel.");
  }

  const pool = mysql.createPool({
    host,
    user,
    password,
    database: dbName,
    port,
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
        name VARCHAR(255) DEFAULT NULL,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) DEFAULT NULL UNIQUE,
        google_id VARCHAR(255) DEFAULT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        role ENUM('admin', 'user', 'manager', 'dealer', 'store_manager', 'assistant_manager', 'cashier', 'sales_executive', 'inventory_manager', 'stock_keeper', 'billing_staff', 'customer_service', 'delivery_staff') NOT NULL DEFAULT 'user',
        created_by CHAR(36) NOT NULL,
        updated_by CHAR(36) NOT NULL,
        budget_mode TINYINT(1) DEFAULT 0,
        budget_amount DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        role VARCHAR(100) NOT NULL,
        gender VARCHAR(20) DEFAULT NULL,
        blood_group VARCHAR(10) DEFAULT NULL,
        dob DATE DEFAULT NULL,
        joining_date DATE DEFAULT NULL,
        qualification VARCHAR(255) DEFAULT NULL,
        experience VARCHAR(50) DEFAULT NULL,
        shift VARCHAR(50) DEFAULT NULL,
        salary DECIMAL(12,2) DEFAULT NULL,
        address TEXT DEFAULT NULL,
        status VARCHAR(20) DEFAULT 'active',
        time_in TIME DEFAULT NULL,
        time_out TIME DEFAULT NULL,
        photo LONGTEXT DEFAULT NULL,
        aadhar_doc LONGTEXT DEFAULT NULL,
        id_doc LONGTEXT DEFAULT NULL,
        certificate_doc LONGTEXT DEFAULT NULL,
        created_by VARCHAR(36) DEFAULT NULL,
        updated_by VARCHAR(36) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } finally {
    connection.release();
  }
};

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

const initDatabase = async () => {
  await createUsersTable();
  await initPurchaseTables();
};

module.exports = {
  createUsersTable,
  createCategoryTable,
  createProductTable,
  initDatabase,
};
