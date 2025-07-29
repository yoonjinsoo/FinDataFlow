const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple API route for testing
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is working" });
});

// Catch all other routes
app.use("*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Export the Express app as a Vercel serverless function
module.exports = app;
