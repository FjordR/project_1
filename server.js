const express = require("express");
const pool = require("./db");
const usersRouter = require("./routes/users");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API is running"
    });
});

app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            status: "healthy",
            database: "connected"
        });
    } catch (err) {
        res.status(500).json({
            status: "unhealthy",
            database: "disconnected"
        });
    }
});

app.use("/users", usersRouter);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
    console.log("SIGTERM received");

    server.close(async () => {
        await pool.end();
        console.log("Process terminated");
    });
});