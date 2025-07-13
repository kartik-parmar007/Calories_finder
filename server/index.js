require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// --- Swagger Setup ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Calories Finder API",
      version: "1.0.0",
      description: "API documentation for Calories Finder",
    },
    servers: [
      { url: "https://calories-finder.vercel.app" },
      { url: "http://localhost:3000" },
    ],
  },
  apis: ["./server/index.js"], // Path to the API docs in JSDoc comments
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Authentication Route (Simple Example) ---
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       400:
 *         description: Invalid credentials
 */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
});

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Signup with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up
 *       400:
 *         description: Error creating user
 */
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user });
});

// --- Home Page Route ---
/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Get home route
 *     responses:
 *       200:
 *         description: Home page info
 */
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
/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search foods for calorie information
 *     parameters:
 *       - in: query
 *         name: food
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of foods matching search
 *       400:
 *         description: Missing food query
 */
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
/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get user's search history
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's search history
 *       400:
 *         description: Missing user_id query
 */
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

/**
 * @swagger
 * /api/history:
 *   post:
 *     summary: Add a search to user history
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               food:
 *                 type: string
 *     responses:
 *       201:
 *         description: History added
 *       400:
 *         description: Missing user_id or food
 */
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
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     responses:
 *       200:
 *         description: API running
 */
app.get("/api/health", (req, res) => res.send("API running!"));

// For local dev
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

// For Vercel serverless export
module.exports = app;
