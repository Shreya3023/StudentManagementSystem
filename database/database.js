const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database file inside the database folder
const dbPath = path.join(__dirname, "students.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create students table
db.run(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        course TEXT,
        year INTEGER
    )
`, (err) => {
    if (err) {
        console.error("Error creating students table:", err.message);
    } else {
        console.log("Students table is ready.");
    }
});

module.exports = db;