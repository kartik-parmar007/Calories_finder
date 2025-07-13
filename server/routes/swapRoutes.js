const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");

/**
 * @swagger
 * tags:
 *   name: Swaps
 *   description: Skill swap management
 */

/**
 * @swagger
 * /api/swaps:
 *   post:
 *     summary: Create a new swap request
 *     tags: [Swaps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender_id:
 *                 type: string
 *               receiver_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Swap request created successfully
 */

/**
 * @swagger
 * /api/swaps/{id}:
 *   patch:
 *     summary: Update swap status
 *     tags: [Swaps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Swap ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Swap updated successfully
 */

router.post("/", async (req, res) => {
  const { sender_id, receiver_id } = req.body;
  const { data, error } = await supabase
    .from("swaps")
    .insert([{ sender_id, receiver_id }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Swap request created", data });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { data, error } = await supabase
    .from("swaps")
    .update({ status })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Swap updated", data });
});

module.exports = router;
