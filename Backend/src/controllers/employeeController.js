const pool = require("../config/db");
const bcrypt = require("bcryptjs");

/* ===========================
   Generate Employee ID
=========================== */

exports.generateEmployeeId = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT employee_id
       FROM employees
       ORDER BY id DESC
       LIMIT 1`
    );

    let next = 1;

    if (rows.length) {
      const num = parseInt(rows[0].employee_id.replace("EMP", ""));
      next = num + 1;
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
  const conn = await pool.getConnection();

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

    const created_by = req.user?.id || null;

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ---------- Insert User ---------- */

    const [userResult] = await conn.query(
      `
      INSERT INTO users
      (
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
      VALUES (?,?,?,?,?,?,?,?,?)
      `,
      [
        name,
        username,
        email,
        hashedPassword,
        phone,
        role,
        status,
        created_by,
        created_by,
      ]
    );

    const userId = userResult.insertId;

    /* ---------- Insert Employee ---------- */

    const [employeeResult] = await conn.query(
      `
      INSERT INTO employees
      (
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
      )
      VALUES
      (
      ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
      )
      `,
      [
        userId,
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
        created_by,
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
    const [rows] = await pool.query(`
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
    const [rows] = await pool.query(
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
   Delete Employee
=========================== */

exports.deleteEmployee = async (req, res) => {
  const conn = await pool.getConnection();

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
      "DELETE FROM users WHERE id=?",
      [userId]
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