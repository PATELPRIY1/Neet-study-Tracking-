const mongoose = require("mongoose");

const plannerTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: false,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "half", "completed", "missed"],
      default: "pending",
    },
  },
  { _id: true },
);

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      enum: ["Physics", "Chemistry", "Botany", "Zoology"],
      required: true,
    },

    tasks: [plannerTaskSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", taskSchema);
