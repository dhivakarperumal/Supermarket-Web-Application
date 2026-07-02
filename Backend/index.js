const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initDatabase } = require("./src/config/db");
const authRouter = require("./src/routers/authRouter");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }
  next(err);
});

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Server is Running 🚀",
  });
});

// Example API
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

// Auth Routes
app.use("/api/auth", authRouter);

// Category Routes
const categoriesRouter = require("./src/routers/categoriesRouter");
app.use("/api/categories", categoriesRouter);

// Product Routes
const productsRouter = require("./src/routers/productsRouter");
app.use("/api/products", productsRouter);

// Port
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();