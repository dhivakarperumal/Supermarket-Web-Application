const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

router.get("/receipt", settingsController.getReceiptSettings);
router.post("/receipt", settingsController.updateReceiptSettings);

module.exports = router;
