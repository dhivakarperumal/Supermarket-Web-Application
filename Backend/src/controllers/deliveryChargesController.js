const { getPool } = require("../config/db");

const resolveActorId = (req, fallback = null) => {
  const body = req?.body || {};
  const headers = req?.headers || {};
  const candidate =
    req?.user?.user_id ||
    req?.user?.id ||
    body?.created_by ||
    body?.updated_by ||
    body?.user_id ||
    headers["x-user-id"] ||
    headers["x-access-token"];

  return candidate || fallback || null;
};

const ensureDeliveryChargesTable = async () => {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS delivery_charges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        base_delivery_charge DECIMAL(10,2) DEFAULT 0.00,
        free_delivery_minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
        per_km_delivery_charge DECIMAL(10,2) DEFAULT 0.00,
        maximum_delivery_distance DECIMAL(10,2) DEFAULT 0.00,
        delivery_area_scope VARCHAR(50) DEFAULT 'City',
        enable_express_delivery TINYINT(1) DEFAULT 0,
        express_delivery_charge DECIMAL(10,2) DEFAULT 0.00,
        estimated_delivery_time VARCHAR(100) DEFAULT '',
        created_by VARCHAR(36) DEFAULT NULL,
        updated_by VARCHAR(36) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } finally {
    connection.release();
  }
};

exports.getDeliveryCharges = async (req, res) => {
  try {
    await ensureDeliveryChargesTable();

    const [rows] = await getPool().query(
      `SELECT * FROM delivery_charges ORDER BY id DESC LIMIT 1`
    );

    const settings = rows[0] || {
      id: null,
      base_delivery_charge: 0,
      free_delivery_minimum_order_amount: 0,
      per_km_delivery_charge: 0,
      maximum_delivery_distance: 0,
      delivery_area_scope: "City",
      enable_express_delivery: 0,
      express_delivery_charge: 0,
      estimated_delivery_time: "",
    };

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Fetch delivery charges failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch delivery charges.",
    });
  }
};

exports.createOrUpdateDeliveryCharges = async (req, res) => {
  try {
    await ensureDeliveryChargesTable();

    const payload = req.body || {};
    const actorId = resolveActorId(req);

    const baseDeliveryCharge = payload.base_delivery_charge ?? payload.baseCharge ?? 0;
    const freeDeliveryMinimumOrderAmount =
      payload.free_delivery_minimum_order_amount ?? payload.freeDeliveryMinimumOrderAmount ?? 0;
    const perKmDeliveryCharge = payload.per_km_delivery_charge ?? payload.perKmDeliveryCharge ?? 0;
    const maximumDeliveryDistance = payload.maximum_delivery_distance ?? payload.maximumDeliveryDistance ?? 0;
    const deliveryAreaScope = payload.delivery_area_scope ?? payload.deliveryAreaScope ?? "City";
    const enableExpressDelivery = payload.enable_express_delivery ?? payload.enableExpressDelivery ? 1 : 0;
    const expressDeliveryCharge = payload.express_delivery_charge ?? payload.expressDeliveryCharge ?? 0;
    const estimatedDeliveryTime = payload.estimated_delivery_time ?? payload.estimatedDeliveryTime ?? "";

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      const [existingRows] = await connection.query(
        `SELECT id FROM delivery_charges ORDER BY id DESC LIMIT 1`
      );

      if (existingRows.length > 0) {
        const existingId = existingRows[0].id;

        await connection.query(
          `UPDATE delivery_charges SET
            base_delivery_charge = ?,
            free_delivery_minimum_order_amount = ?,
            per_km_delivery_charge = ?,
            maximum_delivery_distance = ?,
            delivery_area_scope = ?,
            enable_express_delivery = ?,
            express_delivery_charge = ?,
            estimated_delivery_time = ?,
            updated_by = ?
          WHERE id = ?`,
          [
            baseDeliveryCharge,
            freeDeliveryMinimumOrderAmount,
            perKmDeliveryCharge,
            maximumDeliveryDistance,
            deliveryAreaScope,
            enableExpressDelivery,
            expressDeliveryCharge,
            estimatedDeliveryTime,
            actorId,
            existingId,
          ]
        );

        return res.status(200).json({
          success: true,
          message: "Delivery charges updated successfully.",
          id: existingId,
        });
      }

      const [result] = await connection.query(
        `INSERT INTO delivery_charges (
          base_delivery_charge,
          free_delivery_minimum_order_amount,
          per_km_delivery_charge,
          maximum_delivery_distance,
          delivery_area_scope,
          enable_express_delivery,
          express_delivery_charge,
          estimated_delivery_time,
          created_by,
          updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
        [
          baseDeliveryCharge,
          freeDeliveryMinimumOrderAmount,
          perKmDeliveryCharge,
          maximumDeliveryDistance,
          deliveryAreaScope,
          enableExpressDelivery,
          expressDeliveryCharge,
          estimatedDeliveryTime,
          actorId,
          actorId,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Delivery charges created successfully.",
        id: result.insertId,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create or update delivery charges failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save delivery charges.",
    });
  }
};
