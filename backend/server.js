import pool from "./db.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/auth.js";
import notesRoutes from "./routes/notes.js";
import tenantsRoutes from "./routes/tenants.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/tenants", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tenants");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.use("/auth", authRoutes);
app.use("/notes", authMiddleware, notesRoutes);
app.use("/tenants", authMiddleware, tenantsRoutes);


export default app;
