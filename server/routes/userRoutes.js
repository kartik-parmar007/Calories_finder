const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clerk_id:
 *                 type: string
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post("/", async (req, res) => {
  const { clerk_id, name, location } = req.body;
  const { data, error } = await supabase
    .from("users")
    .insert([{ clerk_id, name, location }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "User created", data });
});

module.exports = router;
