import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create Note
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { tenant, userId } = req.user;

  try {
    const tenantRes = await pool.query(
      "SELECT plan FROM tenants WHERE slug = $1",
      [tenant]
    );
    if (!tenantRes.rows.length) {
      return res.status(400).json({ error: "Tenant not found" });
    }
    const plan = tenantRes.rows[0].plan;

    if (plan === "free") {
      const countRes = await pool.query(
        "SELECT COUNT(*) FROM notes WHERE tenant_id = (SELECT id FROM tenants WHERE slug = $1)",
        [tenant]
      );
      if (parseInt(countRes.rows[0].count) >= 3) {
        return res
          .status(403)
          .json({ error: "Free plan limit reached. Upgrade to Pro." });
      }
    }

    const result = await pool.query(
      "INSERT INTO notes (title, content, tenant_id, user_id) VALUES ($1, $2, (SELECT id FROM tenants WHERE slug=$3), $4) RETURNING *",
      [title, content, tenant, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create note error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// List Notes (with plan info)
router.get("/", authMiddleware, async (req, res) => {
  const { tenant } = req.user;
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE tenant_id = (SELECT id FROM tenants WHERE slug = $1) ORDER BY created_at DESC",
      [tenant]
    );

    const planRes = await pool.query(
      "SELECT plan FROM tenants WHERE slug = $1",
      [tenant]
    );

    const plan = planRes.rows[0]?.plan || "free";

    res.json({ notes: result.rows, plan });
  } catch (err) {
    console.error("Get notes error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Note by ID
router.get("/:id", authMiddleware, async (req, res) => {
  const { tenant } = req.user;
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE id = $1 AND tenant_id = (SELECT id FROM tenants WHERE slug = $2)",
      [id, tenant]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get note error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Update Note
router.put("/:id", authMiddleware, async (req, res) => {
  const { tenant } = req.user;
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      "UPDATE notes SET title=$1, content=$2, updated_at=NOW() WHERE id=$3 AND tenant_id=(SELECT id FROM tenants WHERE slug=$4) RETURNING *",
      [title, content, id, tenant]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update note error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete Note
router.delete("/:id", authMiddleware, async (req, res) => {
  const { tenant } = req.user;
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id=$1 AND tenant_id=(SELECT id FROM tenants WHERE slug=$2) RETURNING *",
      [id, tenant]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
