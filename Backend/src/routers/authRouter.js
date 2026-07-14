const express = require("express");
const {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
  updateBudget,
} = require("../controllers/authController");
const { loginUser, googleLogin } = require("../controllers/loginController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/budget/:user_id", updateBudget);

module.exports = router;
