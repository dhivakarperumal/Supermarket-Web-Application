const { getPool } = require("../config/db");

const initOrdersTable = async () => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL UNIQUE,
                customer_name VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50) NOT NULL,
                order_type VARCHAR(50) DEFAULT 'Shop',
                payment_method VARCHAR(50) DEFAULT 'Cash',
                shipping_address JSON,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Paid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL,
                product_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                variant_info JSON,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
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
        await initOrdersTable(); // Ensure tables exist
        const { customer_name, customer_phone, order_type, payment_method, shipping_address, total_amount, status, items } = req.body;
        
        const order_id = 'ORD-' + Date.now() + Math.floor(Math.random() * 1000);

        await connection.beginTransaction();

        await connection.query(`
            INSERT INTO orders (order_id, customer_name, customer_phone, order_type, payment_method, shipping_address, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            order_id, 
            customer_name, 
            customer_phone, 
            order_type || 'Shop', 
            payment_method || 'Cash', 
            shipping_address ? JSON.stringify(shipping_address) : null,
            total_amount,
            status || 'Paid'
        ]);

        if (items && items.length > 0) {
            for (const item of items) {
                await connection.query(`
                    INSERT INTO order_items (order_id, product_id, name, variant_info, price, quantity, total)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    order_id,
                    item.product_id,
                    item.name,
                    item.variant_info ? JSON.stringify(item.variant_info) : null,
                    item.price,
                    item.quantity,
                    item.total
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

module.exports = { getAllOrders, createOrder, initOrdersTable };
