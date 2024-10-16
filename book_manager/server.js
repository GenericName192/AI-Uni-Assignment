const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");
const path = require("path"); // Import path module

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// API endpoints...

// Example: Get all books
app.get("/api/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add a new book
app.post("/api/books", (req, res) => {
  const { title, author, year, genre } = req.body;
  const available = 1; // Default to available (1 for true in SQLite)

  const sql =
    "INSERT INTO books (title, author, year, genre, available) VALUES (?, ?, ?, ?, ?)";
  db.run(sql, [title, author, year, genre, available], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ id: this.lastID, title, author, year, genre, available });
  });
});

// Other API endpoints...
// (Same as before)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Update an existing book
app.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, year, genre } = req.body;

  const sql = `UPDATE books SET title = ?, author = ?, year = ?, genre = ? WHERE id = ?`;
  db.run(sql, [title, author, year, genre, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, title, author, year, genre });
  });
});

// Delete a specific book
app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM books WHERE id = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send(); // No content to send back
  });
});

// Check out or return a book
app.put("/api/books/checkout/:id", (req, res) => {
  const { id } = req.params;
  const { available } = req.body; // Toggle availability

  const sql = `UPDATE books SET available = ? WHERE id = ?`;
  db.run(sql, [available ? 1 : 0, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, available });
  });
});
