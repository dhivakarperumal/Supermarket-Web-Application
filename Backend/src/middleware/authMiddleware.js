const jwt = require("jsonwebtoken");

/**
 * Middleware: Verify JWT token from Authorization header.
 * Attaches decoded payload to req.user.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/**
 * Middleware: Verify JWT token AND require admin role.
 */
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
  });
};

/**
 * Middleware: Optional token verification (does not block if no token).
 * Useful for routes that show different content for logged-in users.
 */
const optionalToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (token && token !== "undefined" && token !== "null") {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

module.exports = { verifyToken, verifyAdmin, optionalToken };
