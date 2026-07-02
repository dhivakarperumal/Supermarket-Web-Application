const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoriesController");

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:catId", getCategory);
router.put("/:catId", updateCategory);
router.delete("/:catId", deleteCategory);

module.exports = router;
