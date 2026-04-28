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
let databaseReadyPromise = null;

dns.setServers(
  DNS_SERVERS.split(",")
    .map((server) => server.trim())
    .filter(Boolean)
);

app.use(cors());
app.use(express.json({ limit: "15mb" }));

const appSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, trim: true, default: "" },
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
    features: [{ type: String, trim: true }],
    screenshots: [{ type: String, trim: true }],
  },
  { timestamps: true, versionKey: false }
);

const AppModel = mongoose.model("App", appSchema);

// Build a query that matches either the custom `id` string field OR the
// MongoDB ObjectId `_id` — whichever the client happens to send.
// This makes PUT and DELETE resilient to seeded docs that may have been
// created before the custom `id` field was consistently populated.
function buildIdQuery(paramId) {
  const isObjectId = /^[a-f\d]{24}$/i.test(paramId);
  if (isObjectId) {
    return { $or: [{ id: paramId }, { _id: paramId }] };
  }
  return { id: paramId };
}

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

function summarizeRequestApp(payload) {
  return {
    id: payload?.id,
    name: payload?.name,
    division: payload?.division,
    platform: payload?.platform,
    category: payload?.category,
    featuresCount: Array.isArray(payload?.features) ? payload.features.length : 0,
    screenshotsCount: Array.isArray(payload?.screenshots) ? payload.screenshots.length : 0,
    iconLength: typeof payload?.icon === "string" ? payload.icon.length : 0,
    screenshotLengths: Array.isArray(payload?.screenshots)
      ? payload.screenshots.map((item) => (typeof item === "string" ? item.length : 0))
      : [],
  };
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
    console.log("[POST /api/apps] Incoming payload", summarizeRequestApp(payload));
    const app = await AppModel.create(payload);
    console.log("[POST /api/apps] Created app", { id: app.id, name: app.name });
    return res.status(201).json({ ok: true, app });
  } catch (error) {
    console.error("[POST /api/apps] Failed", error.message);
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
    const query = buildIdQuery(req.params.id);
    console.log(`[DELETE /api/apps/${req.params.id}] Query`, query);
    const deleted = await AppModel.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: `App not found (id: ${req.params.id}).`,
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

app.put("/api/apps/:id", authenticateAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    const query = buildIdQuery(req.params.id);
    console.log(`[PUT /api/apps/${req.params.id}] Query`, query, "Payload", summarizeRequestApp(payload));
    const updated = await AppModel.findOneAndUpdate(
      query,
      payload,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        ok: false,
        message: `App not found (id: ${req.params.id}). It may have been deleted or the id is incorrect.`,
      });
    }

    return res.status(200).json({
      ok: true,
      app: updated,
    });
  } catch (error) {
    console.error(`[PUT /api/apps/${req.params.id}] Failed`, error.message);
    return res.status(400).json({
      ok: false,
      message: "Failed to update application.",
      error: error.message,
    });
  }
});

app.use((error, _req, res, next) => {
  if (!error) {
    return next();
  }

  console.error("[Server] Unhandled request error", {
    type: error.type,
    message: error.message,
    status: error.status,
    limit: error.limit,
    length: error.length,
  });

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      ok: false,
      message: "Request payload is too large.",
      error: error.message,
      limit: error.limit,
      length: error.length,
    });
  }

  return res.status(error.status || 500).json({
    ok: false,
    message: "Unexpected server error.",
    error: error.message,
  });
});

async function seedDefaultAppsIfEmpty() {
  const count = await AppModel.countDocuments();
  if (count > 0) return;
  await AppModel.insertMany(defaultApps);
  console.log(`Seeded ${defaultApps.length} default apps into MongoDB.`);
}

async function ensureDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoose.connection.readyState === 2) {
    return databaseReadyPromise;
  }

  if (!databaseReadyPromise) {
    databaseReadyPromise = mongoose.connect(MONGODB_URI)
      .then(async () => {
        console.log("MongoDB connected successfully.");
        await seedDefaultAppsIfEmpty();
      })
      .catch((error) => {
        databaseReadyPromise = null;
        throw error;
      });
  }

  return databaseReadyPromise;
}

async function startServer() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in environment variables.");
    process.exit(1);
  }

  try {
    await ensureDatabase();

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = { app, ensureDatabase, startServer };

if (require.main === module) {
  startServer();
}