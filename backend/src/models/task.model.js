const mongoose = require("mongoose");

const plannerTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "half", "completed", "missed"],
      default: "pending",
    },

    // Keep this temporarily so old data is not lost
    completed: {
      type: Boolean,
      default: false,
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

    // ONE DATE FOR THE WHOLE CHAPTER
    date: {
      type: Date,
      default: null,
    },

    tasks: [plannerTaskSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Task", taskSchema);