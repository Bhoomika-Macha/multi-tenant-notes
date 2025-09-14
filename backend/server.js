import express from "express";
import cors from "cors";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import tenantsRoutes from "./routes/tenants.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoint (required by assignment)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Public route to check tenants (optional, useful for testing)
app.get("/tenants", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tenants");
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use("/tenants", tenantsRoutes);


const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}


export default app;
