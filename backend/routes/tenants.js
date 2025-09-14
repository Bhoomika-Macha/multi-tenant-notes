import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// POST /tenants/:slug/upgrade (Admin only)
router.post("/:slug/upgrade", authMiddleware, async (req, res) => {
  const { role } = req.user;
  const { slug } = req.params;

  if (role !== "admin") {
    return res.status(403).json({ error: "Only Admins can upgrade tenants" });
  }

  try {
    await pool.query("UPDATE tenants SET plan='pro' WHERE slug=$1", [slug]);
    res.json({ message: "Tenant upgraded to Pro" });
  } catch (err) {
    console.error("Upgrade error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
