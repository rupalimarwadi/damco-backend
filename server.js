require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(express.json());

// DB Connection
if (process.env.NODE_ENV !== "test") {
  connectDB();
}
// Routes
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/logs"));


module.exports = app; 

// Start server only if not in test
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}