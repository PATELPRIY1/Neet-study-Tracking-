const express = require("express");
const taskRoutes = require("./routes/task.routes");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");


const app = express();
app.use(
  cors({
    origin: ["https://neet-study-tracking-204o.onrender.com",
    "http://localhost:5173"],
    credentials: true,
  }), 
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

module.exports = app;
