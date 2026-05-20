const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "movie_user",
  password: "movie123",
  database: "movie_crud_db",
  port: 3310,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("MySQL connected successfully");
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("Movie API is running");
});

// GET all movies
app.get("/api/movies", (req, res) => {
  const sql = "SELECT * FROM movies ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send("Error fetching movies");
    }

    res.json(result);
  });
});

// POST add movie
app.post("/api/movies", (req, res) => {
  const movie = req.body;

  const sql = `
    INSERT INTO movies 
    (movie_name, actor_name, actress_name, release_date, director_name, producer_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      movie.movie_name,
      movie.actor_name,
      movie.actress_name,
      movie.release_date,
      movie.director_name,
      movie.producer_name,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send("Movie not added");
      }

      res.send("Movie added successfully");
    }
  );
});

// PUT update movie
app.put("/api/movies/:id", (req, res) => {
  const id = req.params.id;
  const movie = req.body;

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
      movie.movie_name,
      movie.actor_name,
      movie.actress_name,
      movie.release_date,
      movie.director_name,
      movie.producer_name,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send("Movie not updated");
      }

      res.send("Movie updated successfully");
    }
  );
});

// DELETE movie
app.delete("/api/movies/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM movies WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send("Movie not deleted");
    }

    res.send("Movie deleted successfully");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});