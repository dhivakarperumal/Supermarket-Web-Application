const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

router.get("/receipt", settingsController.getReceiptSettings);
router.post("/receipt", settingsController.updateReceiptSettings);

router.get("/payment", settingsController.getPaymentSettings);
router.post("/payment", settingsController.updatePaymentSettings);

router.get("/tax", settingsController.getTaxSettings);
router.post("/tax", settingsController.updateTaxSettings);

module.exports = router;
