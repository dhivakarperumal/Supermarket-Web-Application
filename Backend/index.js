const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initDatabase } = require("./src/config/db");
const authRouter = require("./src/routers/authRouter");
const categoriesRouter = require("./src/routers/categoriesRouter");
const productsRouter = require("./src/routers/productsRouter");
const dashboardRouter = require("./src/routers/dashboardRouter");
const ordersRouter = require("./src/routers/ordersRouter");
const bannersRouter = require("./src/routers/bannersRouter");

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


app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/banners", bannersRouter);

// Port
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();