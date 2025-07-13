const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback management
 */

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit feedback for a swap
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               swap_id:
 *                 type: string
 *               from_user:
 *                 type: string
 *               to_user:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 */

router.post("/", async (req, res) => {
  const { swap_id, from_user, to_user, rating, comment } = req.body;
  const { data, error } = await supabase
    .from("feedback")
    .insert([{ swap_id, from_user, to_user, rating, comment }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Feedback submitted", data });
});

module.exports = router;
