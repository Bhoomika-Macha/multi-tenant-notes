import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!userResult.rows.length) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const tenantResult = await pool.query(
      "SELECT id, slug, plan FROM tenants WHERE id = $1",
      [user.tenant_id]
    );

    if (!tenantResult.rows.length) {
      return res.status(400).json({ error: "Tenant not found" });
    }

    const tenant = tenantResult.rows[0];

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        tenant: tenant.slug,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
