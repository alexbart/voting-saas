// src/app.js
const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const ipCapture = require("./middleware/ipCapture");
const authRoutes = require("./modules/auth/routes");
const electionRoutes = require("./modules/elections/routes");
const voteRoutes = require("./modules/votes/routes");
const auditRoutes = require("./modules/audit/routes");
const notificationRoutes = require("./modules/notifications/routes");
const testRoutes = require("./modules/notifications/test-routes");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false, // disable CSP in dev
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("combined"));
app.use(ipCapture);
app.use(express.static(path.join(__dirname, "../public")));

// Add before other routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/test", testRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Voting SaaS is running!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = app;
