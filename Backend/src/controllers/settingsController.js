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
      barcodeDisplay,
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
          tax_display = ?, discount_display = ?, barcode_display = ?, qr_code_display = ?, 
          footer_message = ?, thank_you_message = ?, return_policy = ?, store_logo = ?,
          receipt_id = ?, updated_by = ?
         WHERE id = ?`,
        [
          storeName, address, phone, email, gst, fssai, invoicePrefix, invoiceFormat, currency, dateFormat,
          taxDisplay, discountDisplay, barcodeDisplay, qrCodeDisplay, footerMessage, thankYouMessage, returnPolicy, storeLogo,
          receiptId, updatedBy, id
        ]
      );
    } else {
      const receiptId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO receipt_settings (
          store_name, address, phone, email, gst, fssai, invoice_prefix, invoice_format, currency, date_format,
          tax_display, discount_display, barcode_display, qr_code_display, footer_message, thank_you_message, return_policy, store_logo,
          receipt_id, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          storeName, address, phone, email, gst, fssai, invoicePrefix, invoiceFormat, currency, dateFormat,
          taxDisplay, discountDisplay, barcodeDisplay, qrCodeDisplay, footerMessage, thankYouMessage, returnPolicy, storeLogo,
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
