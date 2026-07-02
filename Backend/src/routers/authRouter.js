const express = require("express");
const {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
