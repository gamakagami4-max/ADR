const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const jwt = require("jsonwebtoken");
const { defaultApps } = require("./data/defaultApps");

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

const appSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    division: { type: String, required: true, trim: true },
    version: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    access: { type: String, required: true, trim: true },
    status: { type: String, enum: ["beta", "stable"], default: "beta" },
    rating: { type: String, default: "0.0" },
    ratingCount: { type: String, default: "0" },
    stars: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    tagline: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    about: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    size: { type: String, default: "TBD", trim: true },
    updated: { type: String, required: true, trim: true },
    users: { type: String, default: "0 active", trim: true },
  },
  { timestamps: true, versionKey: false }
);

const AppModel = mongoose.model("App", appSchema);

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

function authenticateAdmin(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "Missing authentication token.",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    return next();
  } catch (_err) {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token.",
    });
  }
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
  return authenticateAdmin(req, res, () =>
    res.status(200).json({
      ok: true,
      admin: {
        username: req.admin.username,
      },
    })
  );
});

app.get("/api/apps", async (_req, res) => {
  try {
    const apps = await AppModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, apps });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to load applications.",
      error: error.message,
    });
  }
});

app.post("/api/apps", authenticateAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    const app = await AppModel.create(payload);
    return res.status(201).json({ ok: true, app });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "App id already exists.",
      });
    }
    return res.status(400).json({
      ok: false,
      message: "Failed to create application.",
      error: error.message,
    });
  }
});

app.delete("/api/apps/:id", authenticateAdmin, async (req, res) => {
  try {
    const deleted = await AppModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: "App not found.",
      });
    }
    return res.status(200).json({
      ok: true,
      message: "App deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to delete application.",
      error: error.message,
    });
  }
});

async function seedDefaultAppsIfEmpty() {
  const count = await AppModel.countDocuments();
  if (count > 0) return;
  await AppModel.insertMany(defaultApps);
  console.log(`Seeded ${defaultApps.length} default apps into MongoDB.`);
}

async function startServer() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");
    await seedDefaultAppsIfEmpty();

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
