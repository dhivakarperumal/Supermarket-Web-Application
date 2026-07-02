const crypto = require("crypto");
const { getPool } = require("../config/db");

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      password,
      status = "active",
      role = "user",
      created_by,
      updated_by,
    } = req.body || {};

    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive",
      });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be admin or user",
      });
    }

    const pool = getPool();
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    const userId = crypto.randomUUID();
    const nowCreatedBy = created_by || userId;
    const nowUpdatedBy = updated_by || userId;
    const hashedPassword = hashPassword(password);

    await pool.query(
      `INSERT INTO users (user_id, username, email, phone, password, status, role, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, username, email, phone, hashedPassword, status, role, nowCreatedBy, nowUpdatedBy]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        user_id: userId,
        username,
        email,
        phone,
        status,
        role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering user",
    });
  }
};

module.exports = {
  registerUser,
};
