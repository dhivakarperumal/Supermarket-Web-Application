const { getPool } = require("../config/db");

// ─────────────────────────────────────────────
// Helper: build date-range WHERE clause
// ─────────────────────────────────────────────
const buildDateRange = (range, customFrom, customTo, column = "created_at") => {
  const now = new Date();
  let from, to;

  switch (range) {
    case "today":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      break;
    case "yesterday":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
      break;
    case "week":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      break;
    case "month":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;
    case "custom":
      if (customFrom && customTo) {
        from = new Date(customFrom);
        to = new Date(customTo);
        to.setHours(23, 59, 59);
      }
      break;
    default:
      break;
  }

  if (from && to) {
    return {
      clause: `AND ${column} BETWEEN ? AND ?`,
      params: [from, to],
    };
  }
  return { clause: "", params: [] };
};

// ─────────────────────────────────────────────
// 1. SALES REPORT
// ─────────────────────────────────────────────
const getSalesReport = async (req, res) => {
  try {
    const pool = getPool();
    const {
      range = "month",
      from: customFrom,
      to: customTo,
      invoice_number,
      customer_name,
      payment_method,
      payment_status,
      order_status,
    } = req.query;

    const { clause: dateClause, params: dateParams } = buildDateRange(range, customFrom, customTo);

    let where = "WHERE 1=1 " + dateClause;
    const params = [...dateParams];

    if (invoice_number) { where += " AND order_id LIKE ?"; params.push(`%${invoice_number}%`); }
    if (customer_name) { where += " AND customer_name LIKE ?"; params.push(`%${customer_name}%`); }
    if (payment_method) { where += " AND payment_method = ?"; params.push(payment_method); }
    if (payment_status) { where += " AND payment_status = ?"; params.push(payment_status); }
    if (order_status) { where += " AND status = ?"; params.push(order_status); }

    const [orders] = await pool.query(
      `SELECT 
        order_id, customer_name, customer_email, customer_phone,
        payment_method, payment_status, status,
        total_amount, created_at, order_type
       FROM orders ${where} ORDER BY created_at DESC`,
      params
    );

    // Summary stats
    const [summary] = await pool.query(
      `SELECT 
        COUNT(*) AS total_orders,
        COALESCE(SUM(total_amount),0) AS total_revenue,
        COALESCE(AVG(total_amount),0) AS avg_order_value,
        COALESCE(SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END),0) AS cancelled_count
       FROM orders ${where}`,
      params
    );

    // Monthly trend (last 12 months regardless of range)
    const [monthly] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
              COUNT(*) AS orders,
              COALESCE(SUM(total_amount),0) AS revenue
       FROM orders
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY month ORDER BY month ASC`
    );

    res.json({
      success: true,
      data: orders,
      summary: summary[0],
      monthly,
    });
  } catch (err) {
    console.error("Sales report error:", err);
    res.status(500).json({ success: false, message: "Failed to generate sales report", error: err.message });
  }
};

// ─────────────────────────────────────────────
// 2. PRODUCTS REPORT
// ─────────────────────────────────────────────
const getProductsReport = async (req, res) => {
  try {
    const pool = getPool();
    const { search, category, status } = req.query;

    let where = "WHERE 1=1";
    const params = [];

    if (search) { where += " AND (p.name LIKE ? OR p.product_code LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
    if (category) { where += " AND p.category = ?"; params.push(category); }
    if (status) { where += " AND p.status = ?"; params.push(status); }

    // Products with sales data joined
    const [products] = await pool.query(
      `SELECT 
        p.id, p.name, p.product_code, p.category, p.brand,
        p.selling_price, p.mrp, p.stock_quantity AS stock, p.status,
        p.total_stock, p.expiry_date,
        COALESCE(SUM(oi.quantity), 0) AS total_sold,
        COALESCE(SUM(oi.total), 0) AS total_revenue
       FROM products p
       LEFT JOIN order_items oi ON oi.product_id = p.id
       ${where}
       GROUP BY p.id
       ORDER BY total_sold DESC`,
      params
    );

    // Summary stats
    const [summary] = await pool.query(`
      SELECT
        COUNT(*) AS total_products,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) AS active_products,
        SUM(CASE WHEN status != 'Active' THEN 1 ELSE 0 END) AS inactive_products,
        COALESCE(SUM(stock_quantity * selling_price), 0) AS inventory_value,
        SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) AS out_of_stock,
        SUM(CASE WHEN stock_quantity > 0 AND stock_quantity <= 10 THEN 1 ELSE 0 END) AS low_stock
      FROM products
    `);

    res.json({
      success: true,
      data: products,
      summary: summary[0],
    });
  } catch (err) {
    console.error("Products report error:", err);
    res.status(500).json({ success: false, message: "Failed to generate products report", error: err.message });
  }
};

// ─────────────────────────────────────────────
// 3. CATEGORY REPORT
// ─────────────────────────────────────────────
const getCategoryReport = async (req, res) => {
  try {
    const pool = getPool();

    const [categoryData] = await pool.query(`
      SELECT 
        p.category AS name,
        COUNT(DISTINCT p.id) AS total_products,
        COALESCE(SUM(oi.quantity), 0) AS total_sold,
        COALESCE(SUM(oi.total), 0) AS total_revenue,
        COALESCE(SUM(p.stock_quantity * p.selling_price), 0) AS stock_value,
        COUNT(DISTINCT CASE WHEN p.status = 'Active' THEN p.id END) AS active_products
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      GROUP BY p.category
      ORDER BY total_revenue DESC
    `);

    const [summary] = await pool.query(`
      SELECT COUNT(DISTINCT category) AS total_categories FROM products
    `);

    res.json({
      success: true,
      data: categoryData,
      summary: summary[0],
    });
  } catch (err) {
    console.error("Category report error:", err);
    res.status(500).json({ success: false, message: "Failed to generate category report", error: err.message });
  }
};

// ─────────────────────────────────────────────
// 4. CUSTOMER REPORT
// ─────────────────────────────────────────────
const getCustomerReport = async (req, res) => {
  try {
    const pool = getPool();
    const { range = "month", from: customFrom, to: customTo, search } = req.query;

    const { clause: dateClause, params: dateParams } = buildDateRange(range, customFrom, customTo);

    // Customer-wise aggregation from orders
    let where = "WHERE 1=1 " + dateClause;
    if (search) { where += " AND (customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)"; dateParams.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    const [customers] = await pool.query(
      `SELECT 
        customer_name, customer_email, customer_phone,
        COUNT(*) AS total_orders,
        COALESCE(SUM(total_amount), 0) AS total_spending,
        MAX(created_at) AS last_purchase,
        MIN(created_at) AS first_purchase,
        SUM(CASE WHEN status != 'Cancelled' THEN 1 ELSE 0 END) AS completed_orders
       FROM orders ${where}
       GROUP BY customer_name, customer_email, customer_phone
       ORDER BY total_spending DESC`,
      dateParams
    );

    // Summary
    const [summary] = await pool.query(
      `SELECT
        COUNT(DISTINCT customer_email) AS total_customers,
        COUNT(DISTINCT CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN customer_email END) AS new_customers,
        COUNT(DISTINCT CASE WHEN order_count > 1 THEN customer_email END) AS repeat_customers
       FROM (
         SELECT customer_email, COUNT(*) AS order_count, MAX(created_at) AS created_at FROM orders GROUP BY customer_email
       ) subq`
    );

    res.json({
      success: true,
      data: customers,
      summary: summary[0],
    });
  } catch (err) {
    console.error("Customer report error:", err);
    res.status(500).json({ success: false, message: "Failed to generate customer report", error: err.message });
  }
};

// ─────────────────────────────────────────────
// 5. INVENTORY REPORT
// ─────────────────────────────────────────────
const getInventoryReport = async (req, res) => {
  try {
    const pool = getPool();
    const { search, category, stock_status } = req.query;

    let where = "WHERE 1=1";
    const params = [];

    if (search) { where += " AND (name LIKE ? OR product_code LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
    if (category) { where += " AND category = ?"; params.push(category); }
    if (stock_status === "out") { where += " AND stock_quantity = 0"; }
    else if (stock_status === "low") { where += " AND stock_quantity > 0 AND stock_quantity <= 10"; }
    else if (stock_status === "in") { where += " AND stock_quantity > 10"; }

    const [products] = await pool.query(
      `SELECT 
        id, name, product_code, category, brand,
        stock_quantity, total_stock, selling_price, mrp,
        expiry_date, status,
        (stock_quantity * selling_price) AS stock_value
       FROM products ${where}
       ORDER BY stock_quantity ASC`,
      params
    );

    const [summary] = await pool.query(`
      SELECT
        COUNT(*) AS total_products,
        COALESCE(SUM(stock_quantity), 0) AS total_stock,
        SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) AS out_of_stock,
        SUM(CASE WHEN stock_quantity > 0 AND stock_quantity <= 10 THEN 1 ELSE 0 END) AS low_stock,
        SUM(CASE WHEN stock_quantity > 10 THEN 1 ELSE 0 END) AS available_stock,
        COALESCE(SUM(stock_quantity * selling_price), 0) AS inventory_value
      FROM products
    `);

    // Stock movement: top sold products this month
    const [stockMovement] = await pool.query(`
      SELECT p.name, p.product_code, SUM(oi.quantity) AS units_sold, SUM(oi.total) AS revenue
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.order_id = oi.order_id
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY oi.product_id
      ORDER BY units_sold DESC
      LIMIT 20
    `);

    res.json({
      success: true,
      data: products,
      summary: summary[0],
      stockMovement,
    });
  } catch (err) {
    console.error("Inventory report error:", err);
    res.status(500).json({ success: false, message: "Failed to generate inventory report", error: err.message });
  }
};

// ─────────────────────────────────────────────
// 6. PURCHASE REPORT (Dealer Invoices)
// ─────────────────────────────────────────────
const getPurchaseReport = async (req, res) => {
  try {
    const pool = getPool();
    const {
      range = "month",
      from: customFrom,
      to: customTo,
      supplier,
      payment_status,
    } = req.query;

    const { clause: dateClause, params: dateParams } = buildDateRange(range, customFrom, customTo, "inv.created_at");

    let where = "WHERE 1=1 " + dateClause;
    const params = [...dateParams];

    if (supplier) { where += " AND d.dealerName LIKE ?"; params.push(`%${supplier}%`); }
    if (payment_status) { where += " AND inv.payment_status = ?"; params.push(payment_status); }

    const [purchases] = await pool.query(
      `SELECT 
        inv.invoice_id, inv.invoice_date, inv.status, inv.payment_method, inv.payment_status,
        inv.total_amount, inv.created_at,
        d.dealerName AS supplier_name, d.companyName AS supplier_company,
        d.mobileNumber AS supplier_phone,
        COUNT(ii.id) AS item_count,
        COALESCE(SUM(ii.quantity), 0) AS total_qty
       FROM invoices inv
       LEFT JOIN dealers d ON d.id = inv.dealer_id
       LEFT JOIN invoice_items ii ON ii.invoice_id = inv.invoice_id
       ${where}
       GROUP BY inv.id
       ORDER BY inv.created_at DESC`,
      params
    );

    const [summary] = await pool.query(
      `SELECT
        COUNT(*) AS total_purchases,
        COALESCE(SUM(inv.total_amount), 0) AS total_amount,
        COUNT(DISTINCT inv.dealer_id) AS total_suppliers,
        SUM(CASE WHEN inv.payment_status = 'paid' THEN 1 ELSE 0 END) AS paid_count,
        SUM(CASE WHEN inv.payment_status = 'pending' THEN 1 ELSE 0 END) AS pending_count
       FROM invoices inv
       LEFT JOIN dealers d ON d.id = inv.dealer_id ${where}`,
      params
    );

    // Supplier-wise summary
    const [supplierSummary] = await pool.query(`
      SELECT 
        d.dealerName AS supplier_name, d.companyName,
        COUNT(*) AS total_invoices,
        COALESCE(SUM(inv.total_amount), 0) AS total_spent
      FROM invoices inv
      LEFT JOIN dealers d ON d.id = inv.dealer_id
      GROUP BY inv.dealer_id
      ORDER BY total_spent DESC
      LIMIT 20
    `);

    res.json({
      success: true,
      data: purchases,
      summary: summary[0],
      supplierSummary,
    });
  } catch (err) {
    console.error("Purchase report error:", err);
    res.status(500).json({ success: false, message: "Failed to generate purchase report", error: err.message });
  }
};

module.exports = {
  getSalesReport,
  getProductsReport,
  getCategoryReport,
  getCustomerReport,
  getInventoryReport,
  getPurchaseReport,
};
