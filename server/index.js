require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// --- Authentication Route (Simple Example) ---
// In production, use Clerk or another auth provider's middleware!
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
});

app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user });
});

// --- Home Page Route ---
app.get("/api/home", (req, res) => {
  res.json({
    message: "Welcome to Calories Finder!",
    endpoints: [
      "/api/auth/login",
      "/api/auth/signup",
      "/api/history",
      "/api/search",
    ],
  });
});

// --- Search Route ---
app.get("/api/search", async (req, res) => {
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

// --- History Route ---
// Example: fetch user's search history (requires user_id in query)
app.get("/api/history", async (req, res) => {
  const { user_id } = req.query;
  if (!user_id)
    return res.status(400).json({ error: "Missing 'user_id' query parameter" });

  const { data, error } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", user_id)
    .order("searched_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// --- Add to History (called after search, optional) ---
app.post("/api/history", async (req, res) => {
  const { user_id, food } = req.body;
  if (!user_id || !food)
    return res
      .status(400)
      .json({ error: "Missing 'user_id' or 'food' in body" });

  const { data, error } = await supabase
    .from("search_history")
    .insert([{ user_id, food, searched_at: new Date().toISOString() }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// --- Health Check ---
app.get("/api/health", (req, res) => res.send("API running!"));

// For Vercel serverless export
module.exports = app;

// For local dev
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}
