
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const transactionRoutes =
    require("./routes/transactionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Smart Expense Tracker API!");
});

// Transaction routes
app.use("/api/transactions", transactionRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
