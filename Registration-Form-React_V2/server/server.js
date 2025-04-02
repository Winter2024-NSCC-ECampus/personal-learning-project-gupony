const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "milestone_db",
});

app.get("/", (req, res) => {
  res.send("Hello from Node/Express server!");
});

app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS solution", (err, results) => {
    if (err) {
      console.error("DB test error:", err);
      return res.status(500).json({ error: err });
    }
    res.json({ result: results[0].solution });
  });
});

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log("POST /api/register =>", name, email);

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error("Register error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already in use" });
      }
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({
      message: "User registered",
      userId: result.insertId,
    });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log("POST /api/login =>", email);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Login DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length > 0) {
      const user = results[0];
      // Return name, userId
      return res.json({
        message: "Login successful",
        userId: user.id,
        name: user.name,
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

app.get("/api/todos/:userId", (req, res) => {
  const { userId } = req.params;
  console.log("GET /api/todos/:userId =>", userId);

  const sql = "SELECT * FROM todos WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Fetch todos error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.post("/api/todos", (req, res) => {
  const { userId, text } = req.body;
  console.log("POST /api/todos =>", userId, text);

  if (!userId || !text) {
    return res.status(400).json({ error: "userId and text are required" });
  }

  const sql = "INSERT INTO todos (user_id, text) VALUES (?, ?)";
  db.query(sql, [userId, text], (err, result) => {
    if (err) {
      console.error("Create todo error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Todo created", todoId: result.insertId });
  });
});

app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  console.log("PUT /api/todos/:id =>", id, text, completed);

  let sql = "UPDATE todos SET";
  const fields = [];
  const values = [];

  if (text !== undefined) {
    fields.push("text = ?");
    values.push(text);
  }
  if (completed !== undefined) {
    fields.push("completed = ?");
    values.push(completed);
  }
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  sql += " " + fields.join(", ") + " WHERE id = ?";
  values.push(id);

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Update todo error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Todo updated" });
  });
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  console.log("DELETE /api/todos/:id =>", id);

  const sql = "DELETE FROM todos WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete todo error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  });
});

// ---- WEATHER ROUTE ----
app.get("/api/weather", async (req, res) => {
  const city = req.query.city || "London";

  const apiKey = "3a051d319a5faa0cb796862604379eea";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${apiKey}`;

  try {
    const resp = await axios.get(url);
    res.json(resp.data);
  } catch (err) {
    console.error("Weather API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
