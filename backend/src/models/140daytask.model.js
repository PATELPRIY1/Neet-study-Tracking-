const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  day: {
    type: String,
  },
  biology: {
    type: String,
  },
  physics: {
    type: String,
  },
  chemistry: {
    type: String,
  },
  revision: {
    type: String,
  },
  done: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
});

const taskModel = mongoose.model("DayTask", taskSchema);

module.exports = taskModel;
