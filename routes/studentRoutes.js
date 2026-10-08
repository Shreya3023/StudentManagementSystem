const express = require("express");
const router = express.Router();
const db = require("../database/database");

// GET all students
router.get("/", (req, res) => {
    db.all("SELECT * FROM students ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// GET one student by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (!row) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(row);
    });
});

// ADD a new student
router.post("/", (req, res) => {
    const { name, email, phone, course, year } = req.body;

    if (!name || !email || !course || !year) {
        return res.status(400).json({
            error: "Name, email, course and year are required"
        });
    }

    const sql = `
        INSERT INTO students (name, email, phone, course, year)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [name, email, phone, course, year],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).json({
                        error: "Email already exists"
                    });
                }

                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Student added successfully",
                studentId: this.lastID
            });
        }
    );
});

// UPDATE a student
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const { name, email, phone, course, year } = req.body;

    if (!name || !email || !course || !year) {
        return res.status(400).json({
            error: "Name, email, course and year are required"
        });
    }

    const sql = `
        UPDATE students
        SET name = ?, email = ?, phone = ?, course = ?, year = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [name, email, phone, course, year, id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Student not found"
                });
            }

            res.json({
                message: "Student updated successfully"
            });
        }
    );
});

// DELETE a student
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.run(
        "DELETE FROM students WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Student not found"
                });
            }

            res.json({
                message: "Student deleted successfully"
            });
        }
    );
});

module.exports = router;