const express = require("express");
const { getAllOrders, createOrder, getUserOrders } = require("../controllers/ordersController");

const router = express.Router();

router.get("/", getAllOrders);
router.get("/user/:user_id", getUserOrders);
router.post("/", createOrder);

module.exports = router;
