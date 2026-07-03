const { getPool } = require("../config/db");

const initOrdersTable = async () => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL UNIQUE,
                user_id VARCHAR(100) DEFAULT NULL,
                customer_name VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50) NOT NULL,
                customer_email VARCHAR(255) DEFAULT NULL,
                order_type VARCHAR(50) DEFAULT 'Shop',
                payment_method VARCHAR(50) DEFAULT 'Cash',
                payment_status VARCHAR(50) DEFAULT 'pending',
                payment_id VARCHAR(255) DEFAULT NULL,
                shipping_address JSON,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Paid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Add columns if they don't exist (safe migration)
        const alterColumns = [
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id VARCHAR(100) DEFAULT NULL",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255) DEFAULT NULL",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255) DEFAULT NULL",
            "ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ];
        for (const sql of alterColumns) {
            try { await connection.query(sql); } catch (e) { /* column may already exist */ }
        }

        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL,
                product_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                variant_info JSON,
                variant_color VARCHAR(100) DEFAULT NULL,
                variant_size VARCHAR(100) DEFAULT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                image TEXT DEFAULT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
            )
        `);
    } catch (e) {
        console.error("Error creating orders table:", e);
    } finally {
        connection.release();
    }
};

const createOrder = async (req, res) => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await initOrdersTable();

        const {
            user_id, customer_name, customer_phone, customer_email,
            order_type, payment_method, payment_status, payment_id,
            shipping_address, street_address, city, district, state, zip_code, country,
            total_amount, status, items
        } = req.body;

        const order_id = 'ORD-' + Date.now() + Math.floor(Math.random() * 1000);

        // Build shipping address — accept either a JSON object or individual fields
        let shippingData = null;
        if (shipping_address) {
            shippingData = JSON.stringify(shipping_address);
        } else if (street_address) {
            shippingData = JSON.stringify({ street: street_address, city, district, state, zip: zip_code, country: country || 'India' });
        }

        await connection.beginTransaction();

        await connection.query(`
            INSERT INTO orders (order_id, user_id, customer_name, customer_phone, customer_email, order_type, payment_method, payment_status, payment_id, shipping_address, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            order_id,
            user_id || null,
            customer_name,
            customer_phone || "",
            customer_email || null,
            order_type || 'Shop',
            payment_method || 'Cash',
            payment_status || 'pending',
            payment_id || null,
            shippingData,
            total_amount,
            status || 'Paid'
        ]);

        if (items && items.length > 0) {
            for (const item of items) {
                await connection.query(`
                    INSERT INTO order_items (order_id, product_id, name, variant_info, variant_color, variant_size, price, quantity, total, image)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    order_id,
                    item.product_id || item.id,
                    item.name,
                    item.variant_info ? JSON.stringify(item.variant_info) : null,
                    item.variant_color || item.colorName || null,
                    item.variant_size || item.size || null,
                    item.price,
                    item.quantity,
                    item.total || (parseFloat(item.price) * item.quantity),
                    item.image || null
                ]);
            }
        }

        await connection.commit();
        res.status(201).json({ success: true, message: "Order created successfully", order_id });
    } catch (error) {
        await connection.rollback();
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Server error" });
    } finally {
        connection.release();
    }
};

const getAllOrders = async (req, res) => {
    try {
        await initOrdersTable();
        const pool = getPool();
        const [orders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get orders for a specific user
const getUserOrders = async (req, res) => {
    try {
        await initOrdersTable();
        const pool = getPool();
        const { user_id } = req.params;
        const [orders] = await pool.query(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            [user_id]
        );
        // Fetch items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const [items] = await pool.query(
                "SELECT * FROM order_items WHERE order_id = ?",
                [order.order_id]
            );
            return { ...order, items };
        }));
        res.status(200).json(ordersWithItems);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllOrders, createOrder, getUserOrders, initOrdersTable };
