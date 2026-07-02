const crypto = require("crypto");
const mysql = require("mysql2/promise");

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const allowedRoles = ["admin", "user", "manager", "dealer"];
const allowedStatuses = ["active", "inactive"];

const createConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "supermarket_db",
    port: Number(process.env.DB_PORT || 3306),
  });
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

    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive",
      });
    }

    if (!allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${allowedRoles.join(", ")}`,
      });
    }

    const connection = await createConnection();

    const [existing] = await connection.query(
      "SELECT id FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existing.length > 0) {
      await connection.end();
      return res.status(409).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    const userId = crypto.randomUUID();
    const nowCreatedBy = created_by || userId;
    const nowUpdatedBy = updated_by || userId;
    const hashedPassword = hashPassword(password);

    const [insertResult] = await connection.query(
      `INSERT INTO users (user_id, username, email, phone, password, status, role, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, username, email, phone, hashedPassword, status.toLowerCase(), role.toLowerCase(), nowCreatedBy, nowUpdatedBy]
    );

    await connection.end();

    console.log("registration-inserted", insertResult.insertId);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: insertResult.insertId,
        user_id: userId,
        username,
        email,
        phone,
        status: status.toLowerCase(),
        role: role.toLowerCase(),
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

const getUsers = async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.query(
      `SELECT id, user_id, username, email, phone, role, status, created_at FROM users ORDER BY created_at DESC`
    );
    await connection.end();

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, role, status, password } = req.body || {};

    if (!username || !email || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "username, email, phone and role are required",
      });
    }

    if (!allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${allowedRoles.join(", ")}`,
      });
    }

    if (status && !allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive",
      });
    }

    const connection = await createConnection();
    const [existing] = await connection.query("SELECT id FROM users WHERE id = ?", [id]);

    if (existing.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateFields = [
      "username = ?",
      "email = ?",
      "phone = ?",
      "role = ?",
      "updated_at = CURRENT_TIMESTAMP",
    ];
    const updateValues = [username, email, phone, role.toLowerCase()];

    if (status) {
      updateFields.splice(4, 0, "status = ?");
      updateValues.splice(4, 0, status.toLowerCase());
    }

    if (password) {
      updateFields.push("password = ?");
      updateValues.push(hashPassword(password));
    }

    updateValues.push(id);

    await connection.query(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    await connection.end();
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();
    const [result] = await connection.query("DELETE FROM users WHERE id = ?", [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

module.exports = {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
};
