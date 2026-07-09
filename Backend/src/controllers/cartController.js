const { getPool } = require("../config/db");

const parseJsonField = (value) => {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const enrichCartItem = async (item, pool) => {
    const productId = item.product_id;
    let product = null;

    if (productId) {
        const [rows] = await pool.query(
            "SELECT id, name, thumbnail_image, product_images, mrp, offer_price, selling_price FROM products WHERE id = ?",
            [productId]
        );
        product = rows?.[0] || null;
    }

    const productImages = parseJsonField(product?.product_images);
    const fallbackImage = product?.thumbnail_image || productImages?.[0] || item.image || null;

    return {
        ...item,
        name: item.name || item.product_name || product?.name || "Product",
        product_name: item.product_name || product?.name || item.name || "Product",
        image: item.image || fallbackImage,
        product_image: item.product_image || fallbackImage,
        mrp: item.mrp ?? product?.mrp ?? null,
        price: item.price ?? product?.offer_price ?? product?.selling_price ?? null,
    };
};

const initCartTable = async () => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(100) NOT NULL,
                product_id INT NOT NULL,
                variant_color VARCHAR(100) DEFAULT NULL,
                variant_size VARCHAR(100) DEFAULT NULL,
                image TEXT DEFAULT NULL,
                email VARCHAR(255) DEFAULT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                total_price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (e) {
        console.error("Error creating cart table:", e);
    } finally {
        connection.release();
    }
};

const getCart = async (req, res) => {
    try {
        await initCartTable();
        const pool = getPool();
        const { userId } = req.params;
        const [items] = await pool.query(
            "SELECT * FROM cart WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );
        const enrichedItems = await Promise.all(items.map((item) => enrichCartItem(item, pool)));
        res.status(200).json(enrichedItems);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const addToCart = async (req, res) => {
    try {
        await initCartTable();
        const pool = getPool();
        const { user_id, product_id, variant_color, variant_size, image, email, price, quantity, total_price } = req.body;
        
        // Check if item already exists in cart with same variants
        const [existing] = await pool.query(
            "SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND (variant_color = ? OR (variant_color IS NULL AND ? IS NULL)) AND (variant_size = ? OR (variant_size IS NULL AND ? IS NULL))",
            [user_id, product_id, variant_color || null, variant_color || null, variant_size || null, variant_size || null]
        );

        if (existing.length > 0) {
            // Update quantity
            const item = existing[0];
            const newQuantity = item.quantity + (quantity || 1);
            const newTotal = newQuantity * price;
            await pool.query(
                "UPDATE cart SET quantity = ?, total_price = ? WHERE id = ?",
                [newQuantity, newTotal, item.id]
            );
        } else {
            // Insert new item
            await pool.query(`
                INSERT INTO cart (user_id, product_id, variant_color, variant_size, image, email, price, quantity, total_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                user_id, product_id, variant_color || null, variant_size || null, image || null, email || null, price, quantity || 1, total_price || price
            ]);
        }
        
        const [items] = await pool.query("SELECT * FROM cart WHERE user_id = ?", [user_id]);
        res.status(201).json({ success: true, message: "Added to cart", items });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        await initCartTable();
        const pool = getPool();
        const { cartItemId } = req.params;
        const { quantity, price } = req.body;
        
        const total_price = quantity * price;
        
        await pool.query(
            "UPDATE cart SET quantity = ?, total_price = ? WHERE id = ?",
            [quantity, total_price, cartItemId]
        );
        
        res.status(200).json({ success: true, message: "Cart updated" });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        await initCartTable();
        const pool = getPool();
        const { cartItemId } = req.params;
        
        await pool.query(
            "DELETE FROM cart WHERE id = ?",
            [cartItemId]
        );
        
        res.status(200).json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const clearCart = async (req, res) => {
    try {
        await initCartTable();
        const pool = getPool();
        const { userId } = req.params;
        
        await pool.query(
            "DELETE FROM cart WHERE user_id = ?",
            [userId]
        );
        
        res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
