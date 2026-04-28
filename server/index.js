const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const DNS_SERVERS = process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "Admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

dns.setServers(
  DNS_SERVERS.split(",")
    .map((server) => server.trim())
    .filter(Boolean)
);

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  let dbState = "disconnected";
  if (mongoose.connection.readyState === 1) dbState = "connected";
  if (mongoose.connection.readyState === 2) dbState = "connecting";

  res.status(200).json({
    ok: true,
    message: "Backend is running",
    database: dbState,
  });
});

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim();
}

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({
      ok: false,
      message: "Admin credentials are not configured on the server.",
    });
  }

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: "Username and password are required.",
    });
  }

  const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

  if (!isValid) {
    return res.status(401).json({
      ok: false,
      message: "Invalid admin credentials.",
    });
  }

  const token = jwt.sign(
    { username: ADMIN_USERNAME, role: "admin" },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.status(200).json({
    ok: true,
    message: "Admin login successful.",
    token,
    admin: {
      username: ADMIN_USERNAME,
    },
  });
});

app.get("/api/admin/me", (req, res) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "Missing authentication token.",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({
      ok: true,
      admin: {
        username: payload.username,
      },
    });
  } catch (_err) {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token.",
    });
  }
});

async function startServer() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
