const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database/database");
const studentRoutes = require("./routes/studentRoutes");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/students", studentRoutes);

// Test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "Student Management System backend is working!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});