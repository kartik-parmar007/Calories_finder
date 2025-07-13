const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/admin/ban-user:
 *   post:
 *     summary: Ban a user
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               target_user_id:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User banned successfully
 */

/**
 * @swagger
 * /api/admin/announce:
 *   post:
 *     summary: Create an announcement
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Announcement created successfully
 */

router.post("/ban-user", async (req, res) => {
  const { target_user_id, reason } = req.body;
  const { data, error } = await supabase
    .from("admin_actions")
    .insert([{ action: "ban", target_user_id, reason }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "User banned", data });
});

router.post("/announce", async (req, res) => {
  const { message } = req.body;
  const { data, error } = await supabase
    .from("announcements")
    .insert([{ message }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Announcement created", data });
});

module.exports = router;
