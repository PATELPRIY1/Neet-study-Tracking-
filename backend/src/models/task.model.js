const mongoose = require("mongoose");

const Task = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tasks: [Task],
});

module.exports = mongoose.model(
  "Task",
  taskSchema
);

