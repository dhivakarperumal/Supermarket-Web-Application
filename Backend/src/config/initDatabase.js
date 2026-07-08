const mysql = require("mysql2/promise");

const dbName = process.env.DB_NAME || "supermarket_db";

const createDeliveryChargesTable = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS delivery_charges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      base_delivery_charge DECIMAL(10,2) DEFAULT 0.00,
      free_delivery_minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
      per_km_delivery_charge DECIMAL(10,2) DEFAULT 0.00,
      maximum_delivery_distance DECIMAL(10,2) DEFAULT 0.00,
      delivery_area_scope VARCHAR(50) DEFAULT 'City',
      enable_express_delivery TINYINT(1) DEFAULT 0,
      express_delivery_charge DECIMAL(10,2) DEFAULT 0.00,
      estimated_delivery_time VARCHAR(100) DEFAULT '',
      created_by VARCHAR(36) DEFAULT NULL,
      updated_by VARCHAR(36) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL UNIQUE,
        employee_id VARCHAR(50) DEFAULT NULL UNIQUE,
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
        emergency_name VARCHAR(255) DEFAULT NULL,
        emergency_phone VARCHAR(20) DEFAULT NULL,
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

    await connection.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) DEFAULT NULL
    `);

    await createDeliveryChargesTable(connection);
    // Fix older rows where created_by was stored as a token/string instead of a UUID
    try {
      await connection.query(`
        UPDATE delivery_charges
        SET created_by = updated_by
        WHERE (
          created_by IS NULL
          OR created_by NOT RLIKE '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        )
        AND (
          updated_by RLIKE '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        )
      `);
    } catch (e) {
      // If this fails for some reason, don't block initialization.
      console.warn('delivery_charges migration skipped:', e?.message || e);
    }
  } finally {
    connection.release();
    await pool.end();
  }
};

module.exports = {
  createUsersTable,
  createDeliveryChargesTable,
};
