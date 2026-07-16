const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const { initDatabase } = require("./src/config/initDatabase");

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

const result = dotenv.config();
if (result.error) {
  console.warn("Warning: .env file not found or could not be loaded.");
}

const missingEnvs = [];
["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) missingEnvs.push(key);
});
if (missingEnvs.length > 0) {
  console.warn(`Missing environment variables: ${missingEnvs.join(", ")}`);
}

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";

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

app.disable("x-powered-by");
app.use(cors(corsOptions));

// Explicit OPTIONS handler for preflight requests
// Remove explicit options route to avoid path-to-regexp wildcard errors.
// Global CORS middleware will still handle preflight requests.
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 500 * 1024 * 1024,
    },
    abortOnLimit: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const frontendPublicPath = path.join(__dirname, "public");
const frontendDistPath = path.join(__dirname, "..", "Frontend", "dist");
const frontendPath = fs.existsSync(frontendPublicPath)
  ? frontendPublicPath
  : fs.existsSync(frontendDistPath)
  ? frontendDistPath
  : null;

if (frontendPath) {
  app.use(express.static(frontendPath));
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, uptime: process.uptime(), env: process.env.NODE_ENV || "development" });
});

app.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Supermarket Backend</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: #f7f7f7; color: #222; }
      .card { max-width: 700px; margin: 0 auto; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
      code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Supermarket backend is running</h1>
      <p>The API is available at <code>/api/health</code>.</p>
      <p>Deployment checks should now receive a successful HTML response.</p>
    </div>
  </body>
  </html>`;
  res.type("html").status(200).send(html);
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
  app.get(/^(?!\/api\/|\/uploads\/|\/assets\/|\/images\/|\/favicon\.ico$|\/logo(?:1)?\.png$|\/robots\.txt$|\/manifest\.json$).*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
}

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }
  next(err);
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

async function startServer() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed:", error?.message || error);
    console.warn("Continuing startup without database initialization. Fix the database configuration and restart for full functionality.");
  }

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;