const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");
const { initDatabase } = require("./src/config/db");
const authRouter = require("./src/routers/authRouter");
const categoriesRouter = require("./src/routers/categoriesRouter");
const productsRouter = require("./src/routers/productsRouter");
const dashboardRouter = require("./src/routers/dashboardRouter");
const ordersRouter = require("./src/routers/ordersRouter");
const bannersRouter = require("./src/routers/bannersRouter");
const reviewsRouter = require("./src/routers/reviewsRouter");
const addressRouter = require("./src/routers/addressRouter");
const dealersRouter = require("./src/routers/dealersRouter");
const invoicesRouter = require("./src/routers/invoicesRouter");
const videosRouter = require("./src/routers/videosRouter");
const cartRouter = require('./src/routers/cartRouter');
const wishlistRouter = require('./src/routers/wishlistRouter');
const couponsRouter = require('./src/routers/couponsRouter');
const employeeRoutes = require("./src/routers/employeeRoutes");
const deliveryChargesRouter = require("./src/routers/deliveryChargesRouter");
const reportsRouter = require("./src/routers/reportsRouter");
const attendanceRouter = require("./src/routers/attendanceRouter");
const leaveRouter = require("./src/routers/leaveRouter");
const salaryRouter = require("./src/routers/salaryRouter");
const purchaseRouter = require("./src/routers/purchaseRoutes");
const settingsRouter = require("./src/routers/settingsRouter");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload({
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
}));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/reviews", reviewsRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/dealers", dealersRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/videos", videosRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/staff", employeeRoutes);
app.use("/api/delivery-charges", deliveryChargesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/settings", settingsRouter);

// Port
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;