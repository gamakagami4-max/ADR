const { app, ensureDatabase } = require("../server/index");

module.exports = async (req, res) => {
  try {
    await ensureDatabase();
    return app(req, res);
  } catch (error) {
    console.error("[Vercel] Failed to initialize API", error);
    return res.status(500).json({
      ok: false,
      message: "Failed to initialize server.",
      error: error.message,
    });
  }
};
