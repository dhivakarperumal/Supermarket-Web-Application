const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const als = require("./src/config/context");
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

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const allowedOrigins = [
  "https://supermarket.qtechx.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
        if (isLocalhost) return callback(null, origin);
      } catch (err) {
        return callback(new Error("Not allowed by CORS"));
      }
      if (allowedOrigins.includes(origin)) return callback(null, origin);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token", "x-user-id"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  })
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global Context Middleware for tracking created_by / updated_by
app.use((req, res, next) => {
  let user = null;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      user = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    } catch (err) {
      // Ignore invalid token and continue without user context
    }
  }

  als.run(new Map([["user", user]]), () => {
    next();
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const frontendPublicPath = path.join(__dirname, "public");
const frontendDistPath = path.join(__dirname, "..", "Frontend", "dist");
const frontendPath = fs.existsSync(frontendPublicPath)
  ? frontendPublicPath
  : fs.existsSync(frontendDistPath)
  ? frontendDistPath
  : null;

if (frontendPath) {
  const frontendIndexPath = path.join(frontendPath, "index.html");
  app.use(express.static(frontendPath));
  console.log(`Serving frontend from ${frontendPath}`);

  app.get("/index.html", (req, res) => {
    res.sendFile(frontendIndexPath);
  });

  app.get(/^(?!\/api\/|\/uploads\/|\/assets\/|\/images\/|\/favicon\.ico$|\/logo(?:1)?\.png$|\/robots\.txt$|\/manifest\.json$).*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
}

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
app.get("/health", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send("<h1>Backend Server is Running 🚀</h1>");
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

if (frontendPath) {
  const frontendIndexPath = path.join(frontendPath, "index.html");
  app.get(/^(?!\/api\/|\/uploads\/|\/health$).*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
}

// Port
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;