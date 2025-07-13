const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill management
 */

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Add a new skill
 *     tags: [Skills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill added successfully
 */

router.post("/", async (req, res) => {
  const { user_id, name, type } = req.body;
  const { data, error } = await supabase
    .from("skills")
    .insert([{ user_id, name, type }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Skill added", data });
});

module.exports = router;
