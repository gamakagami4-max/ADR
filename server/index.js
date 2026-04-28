const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const DNS_SERVERS = process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1";

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
