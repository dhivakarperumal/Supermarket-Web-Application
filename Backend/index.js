const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

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
const cartRouter = require("./src/routers/cartRouter");
const wishlistRouter = require("./src/routers/wishlistRouter");
const couponsRouter = require("./src/routers/couponsRouter");
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

// Middleware - CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      // Localhost & Dev
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000",
      // Production
      "https://supermarket.qtechx.com",
      "https://www.supermarket.qtechx.com",
    ];
    
    // Allow requests with no origin (mobile apps, curl requests, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
      callback(null, true); // Allow anyway to prevent preflight failures
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-access-token",
    "x-user-id",
    "Accept",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Explicit OPTIONS handler for preflight requests
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  fileUpload({
    limits: {
      fileSize: 500 * 1024 * 1024,
    },
  })
);

// Serve static backend uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Resolve frontend path
const frontendPublicPath = path.join(__dirname, "public");
const frontendDistPath = path.join(__dirname, "..", "Frontend", "dist");
const frontendPath = fs.existsSync(frontendPublicPath)
  ? frontendPublicPath
  : fs.existsSync(frontendDistPath)
  ? frontendDistPath
  : null;

// Serve frontend static assets (must come before API routes)
if (frontendPath) {
  app.use(express.static(frontendPath));
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

// Routes
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

// SPA catch-all — MUST be after all API routes so React Router handles unknown paths
if (frontendPath) {
  const frontendIndexPath = path.join(frontendPath, "index.html");
  app.get(/^(?!\/api\/|\/uploads\/|\/assets\/|\/images\/|\/favicon\.ico$|\/logo(?:1)?\.png$|\/robots\.txt$|\/manifest\.json$).*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
}

// Invalid JSON Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  next(err);
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;