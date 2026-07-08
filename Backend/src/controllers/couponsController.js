const { getPool } = require("../config/db");

const initCouponsTable = async () => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS coupons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
                discount_value DECIMAL(10, 2) NOT NULL,
                min_order_value DECIMAL(10, 2) DEFAULT 0,
                start_date DATETIME NOT NULL,
                expiry_date DATETIME NOT NULL,
                usage_limit_global INT DEFAULT NULL,
                usage_limit_per_customer INT DEFAULT 1,
                usage_count INT DEFAULT 0,
                status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
                coupon_scope VARCHAR(50) DEFAULT 'all',
                applicable_home_chef_ids JSON,
                applicable_product_ids JSON,
                applicable_category_ids JSON,
                applicable_subcategory_ids JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    } catch (e) {
        console.error("Error creating coupons table:", e);
    } finally {
        connection.release();
    }
};

const getCoupons = async (req, res) => {
    try {
        await initCouponsTable();
        const pool = getPool();
        const [coupons] = await pool.query("SELECT * FROM coupons ORDER BY created_at DESC");
        
        // Parse JSON fields
        const formattedCoupons = coupons.map(c => ({
            ...c,
            applicable_home_chef_ids: c.applicable_home_chef_ids || [],
            applicable_product_ids: c.applicable_product_ids || [],
            applicable_category_ids: c.applicable_category_ids || [],
            applicable_subcategory_ids: c.applicable_subcategory_ids || []
        }));

        res.status(200).json({ success: true, coupons: formattedCoupons });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const getCouponById = async (req, res) => {
    try {
        await initCouponsTable();
        const pool = getPool();
        const { id } = req.params;
        const [coupons] = await pool.query("SELECT * FROM coupons WHERE id = ?", [id]);
        if (coupons.length === 0) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        const c = coupons[0];
        const formattedCoupon = {
            ...c,
            applicable_home_chef_ids: c.applicable_home_chef_ids || [],
            applicable_product_ids: c.applicable_product_ids || [],
            applicable_category_ids: c.applicable_category_ids || [],
            applicable_subcategory_ids: c.applicable_subcategory_ids || []
        };

        res.status(200).json({ success: true, coupon: formattedCoupon });
    } catch (error) {
        console.error("Error fetching coupon:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        await initCouponsTable();
        const pool = getPool();
        const {
            code, name, description, discount_type, discount_value, min_order_value,
            start_date, expiry_date, usage_limit_global, usage_limit_per_customer,
            status, coupon_scope, applicable_home_chef_ids, applicable_product_ids,
            applicable_category_ids, applicable_subcategory_ids
        } = req.body;

        const limitGlobal = usage_limit_global ? parseInt(usage_limit_global) : null;
        const limitCustomer = usage_limit_per_customer ? parseInt(usage_limit_per_customer) : 1;
        const minOrder = min_order_value ? parseFloat(min_order_value) : 0;

        await pool.query(
            `INSERT INTO coupons (
                code, name, description, discount_type, discount_value, min_order_value,
                start_date, expiry_date, usage_limit_global, usage_limit_per_customer,
                status, coupon_scope, applicable_home_chef_ids, applicable_product_ids,
                applicable_category_ids, applicable_subcategory_ids
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                code, name, description || '', discount_type, discount_value, minOrder,
                start_date, expiry_date, limitGlobal, limitCustomer,
                status, coupon_scope,
                JSON.stringify(applicable_home_chef_ids || []),
                JSON.stringify(applicable_product_ids || []),
                JSON.stringify(applicable_category_ids || []),
                JSON.stringify(applicable_subcategory_ids || [])
            ]
        );

        res.status(201).json({ success: true, message: "Coupon created successfully" });
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateCoupon = async (req, res) => {
    try {
        await initCouponsTable();
        const pool = getPool();
        const { id } = req.params;
        const {
            code, name, description, discount_type, discount_value, min_order_value,
            start_date, expiry_date, usage_limit_global, usage_limit_per_customer,
            status, coupon_scope, applicable_home_chef_ids, applicable_product_ids,
            applicable_category_ids, applicable_subcategory_ids
        } = req.body;

        const limitGlobal = usage_limit_global ? parseInt(usage_limit_global) : null;
        const limitCustomer = usage_limit_per_customer ? parseInt(usage_limit_per_customer) : 1;
        const minOrder = min_order_value ? parseFloat(min_order_value) : 0;

        await pool.query(
            `UPDATE coupons SET 
                code = ?, name = ?, description = ?, discount_type = ?, discount_value = ?, min_order_value = ?,
                start_date = ?, expiry_date = ?, usage_limit_global = ?, usage_limit_per_customer = ?,
                status = ?, coupon_scope = ?, applicable_home_chef_ids = ?, applicable_product_ids = ?,
                applicable_category_ids = ?, applicable_subcategory_ids = ?
            WHERE id = ?`,
            [
                code, name, description || '', discount_type, discount_value, minOrder,
                start_date, expiry_date, limitGlobal, limitCustomer,
                status, coupon_scope,
                JSON.stringify(applicable_home_chef_ids || []),
                JSON.stringify(applicable_product_ids || []),
                JSON.stringify(applicable_category_ids || []),
                JSON.stringify(applicable_subcategory_ids || []),
                id
            ]
        );

        res.status(200).json({ success: true, message: "Coupon updated successfully" });
    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        await initCouponsTable();
        const pool = getPool();
        const { id } = req.params;
        await pool.query("DELETE FROM coupons WHERE id = ?", [id]);
        res.status(200).json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    getCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon
};
