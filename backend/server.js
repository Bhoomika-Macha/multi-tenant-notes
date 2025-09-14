import express from "express";
import cors from "cors";
import pool from "./db.js";

import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/auth.js";
import notesRoutes from "./routes/notes.js";
import tenantsRoutes from "./routes/tenants.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Debug DB connection check
app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database(), current_user");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB check error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Public tenants list (optional)
app.get("/tenants", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tenants");
    res.json(result.rows);
  } catch (err) {
    console.error("Tenants fetch error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Debug users (for troubleshooting auth)
app.get("/debug-users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, role, tenant_id, LENGTH(password_hash) as hash_len FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Debug users error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Routes
app.use("/auth", authRoutes);
app.use("/notes", authMiddleware, notesRoutes);
app.use("/tenants", authMiddleware, tenantsRoutes);

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
