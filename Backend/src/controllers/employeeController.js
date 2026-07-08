const { randomUUID } = require("crypto");
const { getPool } = require("../config/db");
const bcrypt = require("bcryptjs");

/* ===========================
   Generate Employee ID
=========================== */

exports.generateEmployeeId = async (req, res) => {
  try {
    const [rows] = await getPool().query(
      `SELECT employee_id
       FROM employees
       ORDER BY id DESC
       LIMIT 1`
    );

    let next = 1;

    if (rows.length && rows[0].employee_id) {
      const match = String(rows[0].employee_id).match(/(\d+)$/);
      if (match) {
        next = parseInt(match[1], 10) + 1;
      }
    }

    const employeeId = `EMP${String(next).padStart(5, "0")}`;

    res.json({ employeeId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   Add Employee
=========================== */

exports.createEmployee = async (req, res) => {
  const conn = await getPool().getConnection();

  try {
    await conn.beginTransaction();

    const {
      name,
      username,
      email,
      password,
      phone,
      employee_id,
      role,
      gender,
      blood_group,
      dob,
      joining_date,
      qualification,
      experience,
      shift,
      salary,
      address,
      emergency_name,
      emergency_phone,
      status,
      time_in,
      time_out,
      photo,
      aadhar_doc,
      id_doc,
      certificate_doc,
    } = req.body;

    const generatedUserId = randomUUID();
    const createdBy = req.user?.user_id || req.user?.id || generatedUserId;
    const normalizedRole = role || "user";
    const normalizedStatus = status || "active";
    const safePassword = password || "123456";
    const hashedPassword = await bcrypt.hash(safePassword, 10);

    /* ---------- Insert User ---------- */

    await conn.query(
      `
      INSERT INTO users
      (
        user_id,
        name,
        username,
        email,
        password,
        phone,
        role,
        status,
        created_by,
        updated_by
      )
      VALUES (?,?,?,?,?,?,?,?,?,?)
      `,
      [
        generatedUserId,
        name,
        username,
        email,
        hashedPassword,
        phone,
        normalizedRole,
        normalizedStatus,
        createdBy,
        createdBy,
      ]
    );

    // Use the UUID as the user_id, not the sequential ID
    const userId = generatedUserId;

    /* ---------- Insert Employee ---------- */

    const [employeeResult] = await conn.query(
      `INSERT INTO employees (
        user_id,
        employee_id,
        name,
        username,
        email,
        phone,
        role,
        gender,
        blood_group,
        dob,
        joining_date,
        qualification,
        experience,
        shift,
        salary,
        address,
        emergency_name,
        emergency_phone,
        status,
        time_in,
        time_out,
        photo,
        aadhar_doc,
        id_doc,
        certificate_doc,
        created_by,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`,
      [
        userId,
        employee_id,
        name,
        username,
        email,
        phone,
        normalizedRole,
        gender,
        blood_group,
        dob,
        joining_date,
        qualification,
        experience,
        shift,
        salary,
        address,
        emergency_name,
        emergency_phone,
        normalizedStatus,
        time_in,
        time_out,
        photo,
        aadhar_doc,
        id_doc,
        certificate_doc,
        createdBy,
        createdBy,
      ]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Employee Created Successfully",
      employeeId: employeeResult.insertId,
      userId,
    });
  } catch (err) {
    await conn.rollback();
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    conn.release();
  }
};

/* ===========================
   Get All Employees
=========================== */

exports.getEmployees = async (req, res) => {
  try {
    const [rows] = await getPool().query(`
      SELECT *
      FROM employees
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   Get Single Employee
=========================== */

exports.getEmployee = async (req, res) => {
  try {
    const [rows] = await getPool().query(
      "SELECT * FROM employees WHERE id=?",
      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({
        message: "Employee Not Found",
      });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   Update Employee
=========================== */

exports.updateEmployee = async (req, res) => {
  const conn = await getPool().getConnection();

  try {
    await conn.beginTransaction();

    const {
      name,
      username,
      email,
      phone,
      employee_id,
      role,
      gender,
      blood_group,
      dob,
      joining_date,
      qualification,
      experience,
      shift,
      salary,
      address,
      emergency_name,
      emergency_phone,
      status,
      time_in,
      time_out,
      photo,
      aadhar_doc,
      id_doc,
      certificate_doc,
    } = req.body || {};

    const updatedBy = req.user?.user_id || req.user?.id || "system";

    const [employeeRows] = await conn.query(
      "SELECT user_id FROM employees WHERE id=?",
      [req.params.id]
    );

    if (!employeeRows.length) {
      await conn.rollback();
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    const userId = employeeRows[0].user_id;

    await conn.query(
      `UPDATE employees SET
        employee_id=?, name=?, username=?, email=?, phone=?, role=?, gender=?, blood_group=?, dob=?, joining_date=?, qualification=?, experience=?, shift=?, salary=?, address=?, emergency_name=?, emergency_phone=?, status=?, time_in=?, time_out=?, photo=?, aadhar_doc=?, id_doc=?, certificate_doc=?, updated_by=?
      WHERE id=?`,
      [
        employee_id || null,
        name || null,
        username || null,
        email || null,
        phone || null,
        role || "user",
        gender || null,
        blood_group || null,
        dob || null,
        joining_date || null,
        qualification || null,
        experience || null,
        shift || null,
        salary || null,
        address || null,
        emergency_name || null,
        emergency_phone || null,
        status || "active",
        time_in || null,
        time_out || null,
        photo || null,
        aadhar_doc || null,
        id_doc || null,
        certificate_doc || null,
        updatedBy,
        req.params.id,
      ]
    );

    await conn.query(
      `UPDATE users SET
        name=?, username=?, email=?, phone=?, role=?, status=?, updated_by=?
      WHERE id=? OR user_id=?`,
      [
        name || null,
        username || null,
        email || null,
        phone || null,
        role || "user",
        status || "active",
        updatedBy,
        userId,
        userId,
      ]
    );

    await conn.commit();

    res.json({
      success: true,
      message: "Employee Updated Successfully",
    });
  } catch (err) {
    await conn.rollback();
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  } finally {
    conn.release();
  }
};

/* ===========================
   Delete Employee
=========================== */

exports.deleteEmployee = async (req, res) => {
  const conn = await getPool().getConnection();

  try {
    await conn.beginTransaction();

    const [employee] = await conn.query(
      "SELECT user_id FROM employees WHERE id=?",
      [req.params.id]
    );

    if (!employee.length) {
      return res.status(404).json({
        message: "Employee Not Found",
      });
    }

    const userId = employee[0].user_id;

    await conn.query(
      "DELETE FROM employees WHERE id=?",
      [req.params.id]
    );

    await conn.query(
      "DELETE FROM users WHERE id=? OR user_id=?",
      [userId, userId]
    );

    await conn.commit();

    res.json({
      success: true,
      message: "Employee Deleted Successfully",
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({
      message: err.message,
    });
  } finally {
    conn.release();
  }
};