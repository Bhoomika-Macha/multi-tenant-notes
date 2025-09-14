import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt:", email);

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!userResult.rows.length) {
      console.log("No user found for:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    console.log("Found user:", user.email, "Role:", user.role);

    const valid = await bcrypt.compare(password, user.password_hash);
    console.log("Password valid?", valid);

    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const tenantResult = await pool.query(
      "SELECT id, slug, plan FROM tenants WHERE id = $1",
      [user.tenant_id]
    );

    if (!tenantResult.rows.length) {
      console.log("Tenant not found for id:", user.tenant_id);
      return res.status(400).json({ error: "Tenant not found" });
    }

    const tenant = tenantResult.rows[0];
    console.log("Tenant:", tenant.slug, "Plan:", tenant.plan);

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

    console.log("Token generated for:", user.email);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
