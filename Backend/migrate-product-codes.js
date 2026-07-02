// Migration script to fix product codes from numeric to SPM format
// Run this once after updating the backend

const mysql = require("mysql2/promise");
require("dotenv").config();

const fixProductCodes = async () => {
  let connection;
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "supermarket_db",
      port: Number(process.env.DB_PORT || 3306),
    });

    connection = await pool.getConnection();

    console.log("🔄 Starting product code migration...");

    // Find all products with numeric-only product codes
    const [products] = await connection.execute(`
      SELECT id, product_code FROM products 
      WHERE product_code REGEXP '^[0-9]+$'
      ORDER BY id ASC
    `);

    console.log(`Found ${products.length} products with numeric-only codes`);

    if (products.length > 0) {
      for (const product of products) {
        const num = parseInt(product.product_code, 10);
        const newCode = `SPM${String(num).padStart(3, '0')}`;

        await connection.execute(
          "UPDATE products SET product_code = ? WHERE id = ?",
          [newCode, product.id]
        );

        console.log(
          `✓ Product ID ${product.id}: ${product.product_code} → ${newCode}`
        );
      }

      console.log("\n✅ Migration complete!");
    } else {
      console.log("✓ All products already have proper format");
    }

    await pool.end();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

fixProductCodes();
