const mongoose = require("mongoose");

const plannerTaskSchema = new mongoose.Schema(
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
  { _id: true },
);

const weeklyPlannerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      enum: ["Physics", "Chemistry", "Botany", "Zoology"],
      required: true,
    },

    weekStart: {
      type: Date,
      required: true,
    },

    weekEnd: {
      type: Date,
      required: true,
    },

    tasks: [plannerTaskSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("WeeklyPlanner", weeklyPlannerSchema);
