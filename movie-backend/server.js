const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "movie_user",
  password: "movie123",
  database: "movie_crud_db",
  port: 3310,
});

// Database connect
db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
    return;
  }

  console.log("MySQL connected successfully");
});

// Test route
app.get("/", (req, res) => {
  res.send("Movie CRUD API is running");
});

// Get all movies
app.get("/api/movies", (req, res) => {
  const sql = "SELECT * FROM movies ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error fetching movies",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// Add movie
app.post("/api/movies", (req, res) => {
  const {
    movie_name,
    actor_name,
    actress_name,
    release_date,
    director_name,
    producer_name,
  } = req.body;

  if (
    !movie_name ||
    !actor_name ||
    !actress_name ||
    !release_date ||
    !director_name ||
    !producer_name
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
    INSERT INTO movies
    (movie_name, actor_name, actress_name, release_date, director_name, producer_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      movie_name,
      actor_name,
      actress_name,
      release_date,
      director_name,
      producer_name,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error adding movie",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Movie added successfully",
        movieId: result.insertId,
      });
    }
  );
});

// Update movie
app.put("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  const {
    movie_name,
    actor_name,
    actress_name,
    release_date,
    director_name,
    producer_name,
  } = req.body;

  if (
    !movie_name ||
    !actor_name ||
    !actress_name ||
    !release_date ||
    !director_name ||
    !producer_name
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
    UPDATE movies
    SET movie_name = ?,
        actor_name = ?,
        actress_name = ?,
        release_date = ?,
        director_name = ?,
        producer_name = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      movie_name,
      actor_name,
      actress_name,
      release_date,
      director_name,
      producer_name,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error updating movie",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Movie not found",
        });
      }

      res.json({
        message: "Movie updated successfully",
      });
    }
  );
});

// Delete movie
app.delete("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM movies WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting movie",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json({
      message: "Movie deleted successfully",
    });
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});