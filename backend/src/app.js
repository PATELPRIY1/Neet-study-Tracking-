const express = require("express");
const taskRoutes = require("./routes/task.routes");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const weeklyPlannerRoutes = require("./routes/weekly.routes");
const cors = require("cors");

const app = express();

const allowOrigins = [
  "http://localhost:5173",
  "https://neet-study-tracking-204o.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/", taskRoutes);
app.use("/", weeklyPlannerRoutes);

module.exports = app;
