const { getPool } = require("../config/db");

/* ── Auto-create banners table ── */
const createBannersTable = async () => {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS banners (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL DEFAULT '',
                subtitle VARCHAR(255) DEFAULT '',
                description TEXT DEFAULT '',
                image LONGTEXT DEFAULT '',
                mobile_image LONGTEXT DEFAULT '',
                link VARCHAR(500) DEFAULT '',
                type ENUM('hero', 'promo', 'banner', 'popup', 'sidebar') NOT NULL DEFAULT 'hero',
                active TINYINT(1) NOT NULL DEFAULT 1,
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    } finally {
        connection.release();
    }
};

/* ── GET all banners ── */
const getAllBanners = async (req, res) => {
    try {
        await createBannersTable();
        const pool = getPool();
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC"
            );
            const banners = rows.map(row => ({
                ...row,
                active: !!row.active
            }));
            return res.status(200).json(banners);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Fetch banners failed:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch banners." });
    }
};

/* ── POST create banner ── */
const createBanner = async (req, res) => {
    try {
        await createBannersTable();
        const data = req.body || {};

        if (!data.title) {
            return res.status(400).json({ success: false, message: "Title is required." });
        }

        const pool = getPool();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                `INSERT INTO banners (title, subtitle, description, image, mobile_image, link, type, active, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.title || "",
                    data.subtitle || "",
                    data.description || "",
                    data.image || "",
                    data.mobile_image || "",
                    data.link || "",
                    data.type || "hero",
                    data.active !== undefined ? (data.active ? 1 : 0) : 1,
                    data.sort_order || 0
                ]
            );
            return res.status(201).json({
                success: true,
                message: "Banner created successfully.",
                id: result.insertId
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Create banner failed:", error);
        if (error.code === "ER_NET_PACKET_TOO_LARGE" || error.sqlMessage?.includes("max_allowed_packet")) {
            return res.status(413).json({ success: false, message: "Images are too large. Please use smaller images." });
        }
        return res.status(500).json({ success: false, message: error.message || "Failed to create banner." });
    }
};

/* ── PUT update banner ── */
const updateBanner = async (req, res) => {
    try {
        await createBannersTable();
        const { id } = req.params;
        const data = req.body || {};

        const pool = getPool();
        const connection = await pool.getConnection();
        try {
            const [existing] = await connection.execute("SELECT * FROM banners WHERE id = ?", [id]);
            if (existing.length === 0) {
                return res.status(404).json({ success: false, message: "Banner not found." });
            }

            await connection.execute(
                `UPDATE banners SET
                    title = ?, subtitle = ?, description = ?, image = ?, mobile_image = ?,
                    link = ?, type = ?, active = ?, sort_order = ?, updated_at = NOW()
                 WHERE id = ?`,
                [
                    data.title || existing[0].title,
                    data.subtitle || existing[0].subtitle || "",
                    data.description || existing[0].description || "",
                    data.image || existing[0].image || "",
                    data.mobile_image || existing[0].mobile_image || "",
                    data.link || existing[0].link || "",
                    data.type || existing[0].type,
                    data.active !== undefined ? (data.active ? 1 : 0) : existing[0].active,
                    data.sort_order !== undefined ? data.sort_order : existing[0].sort_order,
                    id
                ]
            );
            return res.status(200).json({ success: true, message: "Banner updated successfully." });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Update banner failed:", error);
        if (error.code === "ER_NET_PACKET_TOO_LARGE" || error.sqlMessage?.includes("max_allowed_packet")) {
            return res.status(413).json({ success: false, message: "Images are too large. Please use smaller images." });
        }
        return res.status(500).json({ success: false, message: "Failed to update banner." });
    }
};

/* ── DELETE banner ── */
const deleteBanner = async (req, res) => {
    try {
        await createBannersTable();
        const { id } = req.params;
        const pool = getPool();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute("DELETE FROM banners WHERE id = ?", [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Banner not found." });
            }
            return res.status(200).json({ success: true, message: "Banner deleted successfully." });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Delete banner failed:", error);
        return res.status(500).json({ success: false, message: "Failed to delete banner." });
    }
};

module.exports = { getAllBanners, createBanner, updateBanner, deleteBanner };
