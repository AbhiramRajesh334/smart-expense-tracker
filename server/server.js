require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

const startServer = async () => {
    try {
        // Connect to Database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully");

        // Initialize Middleware
        app.use(cors());
        app.use(express.json());

        // Initialize Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/expenses", expenseRoutes);

        app.get("/", (req, res) => {
            res.send("API is running");
        });

        // Start Server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

startServer();