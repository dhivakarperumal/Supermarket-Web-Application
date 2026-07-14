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
      free_delivery_km DECIMAL(10,2) DEFAULT 0.00,
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

  try {
    await connection.query(`
      ALTER TABLE delivery_charges
      ADD COLUMN IF NOT EXISTS free_delivery_km DECIMAL(10,2) DEFAULT 0.00
    `);
  } catch (err) {
    console.warn('delivery_charges free_delivery_km migration skipped:', err?.message || err);
  }
};

const createReceiptSettingsTable = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS receipt_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      store_name VARCHAR(255) DEFAULT NULL,
      address TEXT DEFAULT NULL,
      phone VARCHAR(50) DEFAULT NULL,
      email VARCHAR(255) DEFAULT NULL,
      gst VARCHAR(50) DEFAULT NULL,
      fssai VARCHAR(50) DEFAULT NULL,
      invoice_prefix VARCHAR(50) DEFAULT NULL,
      invoice_format VARCHAR(50) DEFAULT NULL,
      currency VARCHAR(10) DEFAULT NULL,
      date_format VARCHAR(20) DEFAULT NULL,
      tax_display TINYINT(1) DEFAULT 1,
      discount_display TINYINT(1) DEFAULT 1,
      barcode_display TINYINT(1) DEFAULT 1,
      qr_code_display TINYINT(1) DEFAULT 1,
      footer_message TEXT DEFAULT NULL,
      thank_you_message TEXT DEFAULT NULL,
      return_policy TEXT DEFAULT NULL,
      store_logo LONGTEXT DEFAULT NULL,
      receipt_id VARCHAR(36) DEFAULT NULL,
      created_by VARCHAR(36) DEFAULT NULL,
      updated_by VARCHAR(36) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  try {
    await connection.query(`
      ALTER TABLE receipt_settings
      ADD COLUMN IF NOT EXISTS receipt_id VARCHAR(36) DEFAULT NULL,
      MODIFY COLUMN store_logo LONGTEXT DEFAULT NULL
    `);
  } catch (err) {
    console.warn('receipt_settings alter skipped:', err?.message || err);
  }
};

const createPaymentIntegrationTable = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS payment_integration (
      id INT AUTO_INCREMENT PRIMARY KEY,
      payment_id VARCHAR(36) UNIQUE NOT NULL,
      primary_gateway VARCHAR(100) DEFAULT NULL,
      cash_support TINYINT(1) DEFAULT 1,
      upi_support TINYINT(1) DEFAULT 1,
      upi_id VARCHAR(255) DEFAULT NULL,
      credit_debit_card TINYINT(1) DEFAULT 1,
      merchant_id VARCHAR(255) DEFAULT NULL,
      api_key VARCHAR(255) DEFAULT NULL,
      secret_key VARCHAR(255) DEFAULT NULL,
      webhook_url VARCHAR(255) DEFAULT NULL,
      callback_url VARCHAR(255) DEFAULT NULL,
      mode VARCHAR(50) DEFAULT 'Live',
      auto_payment_verification TINYINT(1) DEFAULT 1,
      refund_support TINYINT(1) DEFAULT 1,
      partial_payment TINYINT(1) DEFAULT 0,
      wallet_payment TINYINT(1) DEFAULT 1,
      cod TINYINT(1) DEFAULT 1,
      emi_support TINYINT(1) DEFAULT 0,
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
    // Increase max_allowed_packet globally to support large base64 images
    try {
      await adminConnection.query(`SET GLOBAL max_allowed_packet = 268435456`); // 256MB
    } catch (e) {
      console.warn('⚠️  Could not set global max_allowed_packet (may need SUPER privilege). Consider adding max_allowed_packet=256M to my.ini');
    }
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

    try {
      await connection.query(`
        ALTER TABLE employees
        DROP COLUMN IF EXISTS employee_id,
        DROP COLUMN IF EXISTS emergency_name,
        DROP COLUMN IF EXISTS emergency_phone
      `);
    } catch (migrationErr) {
      console.warn('⚠️  employees migration skipped:', migrationErr?.message || migrationErr);
    }

    // Ensure the employees.user_id foreign key references users.user_id (UUID)
    try {
      // Attempt to drop any existing foreign key named fk_employee_user (may reference users.id)
      try {
        await connection.query(`ALTER TABLE employees DROP FOREIGN KEY fk_employee_user`);
      } catch (fkDropErr) {
        // ignore if it doesn't exist or cannot be dropped
      }

      // Convert any existing numeric employee.user_id values (old behavior) to the users.user_id UUID
      try {
        await connection.query(`UPDATE employees e JOIN users u ON e.user_id = u.id SET e.user_id = u.user_id`);
      } catch (convertErr) {
        // ignore conversion errors; proceed to attempt to add the FK
      }

      // Add the correct foreign key referencing the users.user_id UUID column
      await connection.query(`ALTER TABLE employees ADD CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE`);
    } catch (fkErr) {
      console.warn('⚠️  employees foreign-key migration skipped:', fkErr?.message || fkErr);
    }

    await connection.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS budget_mode TINYINT(1) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS budget_amount DECIMAL(10,2) DEFAULT 0.00
    `);

    await createDeliveryChargesTable(connection);
    await createReceiptSettingsTable(connection);
    await createPaymentIntegrationTable(connection);
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
  createReceiptSettingsTable,
  createPaymentIntegrationTable,
};
