const express = require("express");
const taskRoutes = require("./routes/task.routes");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
require("dotenv").config();
const { VITE_API_URL } = process.env;

const app = express();
app.use(
  cors({
    origin: VITE_API_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

module.exports = app;
