require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Simple health check
app.get("/api/health", (req, res) => res.send("API is running!"));

// Calories search endpoint
app.get("/api/calories", async (req, res) => {
  const { food } = req.query;
  if (!food)
    return res.status(400).json({ error: "Missing 'food' query parameter" });

  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .ilike("name", `%${food}%`);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}
module.exports = app;