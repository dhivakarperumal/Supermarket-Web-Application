const { getPool } = require("../config/db");
const crypto = require("crypto");

// Get Receipt Settings
exports.getReceiptSettings = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM receipt_settings LIMIT 1");
    if (rows.length === 0) {
      return res.status(200).json({ success: true, data: {} });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching receipt settings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Receipt Settings
exports.updateReceiptSettings = async (req, res) => {
  try {
    const pool = getPool();
    const {
      storeName,
      address,
      phone,
      email,
      gst,
      fssai,
      invoicePrefix,
      invoiceFormat,
      currency,
      dateFormat,
      taxDisplay,
      discountDisplay,
      qrCodeDisplay,
      footerMessage,
      thankYouMessage,
      returnPolicy,
      storeLogo
    } = req.body;

    const userId = req.headers['x-user-id'] || null;
    const createdBy = userId;
    const updatedBy = userId;

    const [rows] = await pool.query("SELECT id, receipt_id FROM receipt_settings LIMIT 1");

    if (rows.length > 0) {
      const id = rows[0].id;
      const receiptId = rows[0].receipt_id || crypto.randomUUID();
      await pool.query(
        `UPDATE receipt_settings SET 
          store_name = ?, address = ?, phone = ?, email = ?, gst = ?, fssai = ?, 
          invoice_prefix = ?, invoice_format = ?, currency = ?, date_format = ?, 
          tax_display = ?, discount_display = ?, qr_code_display = ?, 
          footer_message = ?, thank_you_message = ?, return_policy = ?, store_logo = ?,
          receipt_id = ?, updated_by = ?
         WHERE id = ?`,
        [
          storeName, address, phone, email, gst, fssai, invoicePrefix, invoiceFormat, currency, dateFormat,
          taxDisplay, discountDisplay, qrCodeDisplay, footerMessage, thankYouMessage, returnPolicy, storeLogo,
          receiptId, updatedBy, id
        ]
      );
    } else {
      const receiptId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO receipt_settings (
          store_name, address, phone, email, gst, fssai, invoice_prefix, invoice_format, currency, date_format,
          tax_display, discount_display, qr_code_display, footer_message, thank_you_message, return_policy, store_logo,
          receipt_id, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          storeName, address, phone, email, gst, fssai, invoicePrefix, invoiceFormat, currency, dateFormat,
          taxDisplay, discountDisplay, qrCodeDisplay, footerMessage, thankYouMessage, returnPolicy, storeLogo,
          receiptId, createdBy, updatedBy
        ]
      );
    }

    res.status(200).json({ success: true, message: "Receipt settings saved successfully." });
  } catch (error) {
    console.error("Error updating receipt settings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Payment Settings
exports.getPaymentSettings = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM payment_integration LIMIT 1");
    if (rows.length === 0) {
      return res.status(200).json({ success: true, data: {} });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Payment Settings
exports.updatePaymentSettings = async (req, res) => {
  try {
    const pool = getPool();
    const {
      upiSupport,
      upiId,
    } = req.body;

    const userId = req.headers['x-user-id'] || null;
    const createdBy = userId;
    const updatedBy = userId;

    const [rows] = await pool.query("SELECT id, payment_id FROM payment_integration LIMIT 1");

    if (rows.length > 0) {
      const id = rows[0].id;
      const paymentId = rows[0].payment_id || crypto.randomUUID();
      await pool.query(
        `UPDATE payment_integration SET
upi_support=?,
upi_id=?,
payment_id=?,
updated_by=?
WHERE id=?`,
        [
          upiSupport,
          upiId,
          paymentId,
          updatedBy,
          id
        ]
      );
    } else {
      const paymentId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO payment_integration(
upi_support,
upi_id,
payment_id,
created_by,
updated_by
)
VALUES (?, ?, ?, ?, ?)`,
        [
          upiSupport,
          upiId,
          paymentId,
          createdBy,
          updatedBy
        ]
      );
    }

    res.status(200).json({ success: true, message: "Payment settings saved successfully." });
  } catch (error) {
    console.error("Error updating payment settings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Get Tax Settings
exports.getTaxSettings = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM tax_settings LIMIT 1");
    if (rows.length === 0) {
      return res.status(200).json({ success: true, data: {} });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching tax settings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Tax Settings
exports.updateTaxSettings = async (req, res) => {
  try {
    const pool = getPool();
    const {
      enableGst,
      defaultGstPercentage,
      taxMode
    } = req.body;

    const userId = req.headers['x-user-id'] || null;
    const createdBy = userId;
    const updatedBy = userId;

    const [rows] = await pool.query("SELECT id, tax_id FROM tax_settings LIMIT 1");

    if (rows.length > 0) {
      const id = rows[0].id;
      const taxId = rows[0].tax_id || crypto.randomUUID();
      await pool.query(
        `UPDATE tax_settings SET
enable_gst=?,
default_gst_percentage=?,
tax_mode=?,
tax_id=?,
updated_by=?
WHERE id=?`,
        [
          enableGst,
          defaultGstPercentage,
          taxMode,
          taxId,
          updatedBy,
          id
        ]
      );
    } else {
      const taxId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO tax_settings(
enable_gst,
default_gst_percentage,
tax_mode,
tax_id,
created_by,
updated_by
)
VALUES (?, ?, ?, ?, ?, ?)`,
        [
          enableGst,
          defaultGstPercentage,
          taxMode,
          taxId,
          createdBy,
          updatedBy
        ]
      );
    }

    res.status(200).json({ success: true, message: "Tax settings saved successfully." });
  } catch (error) {
    console.error("Error updating tax settings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
