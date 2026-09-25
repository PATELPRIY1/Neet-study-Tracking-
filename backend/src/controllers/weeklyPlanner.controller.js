const WeeklyPlanner = require("../models/weeklyPlanner.model");

// GET all planner chapters
const getPlanner = async (req, res) => {
  try {
    const planners = await WeeklyPlanner.find({
      user: req.user.id,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      planners,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch planner",
    });
  }
};

// CREATE chapter
const createPlanner = async (req, res) => {
  try {
    const { title, subject, weekStart, weekEnd, tasks } = req.body;

    const planner = await WeeklyPlanner.create({
      user: req.user.id,
      title,
      subject,
      weekStart,
      weekEnd,
      tasks,
    });

    res.status(201).json({
      message: "Planner created successfully",
      planner,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create planner",
    });
  }
};

// UPDATE checkbox/task
const updatePlannerTask = async (req, res) => {
  try {
    const { plannerId, taskId } = req.params;
    const { completed } = req.body;

    const planner = await WeeklyPlanner.findOne({
      _id: plannerId,
      user: req.user.id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found",
      });
    }

    const task = planner.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.completed = completed;

    await planner.save();

    res.status(200).json({
      message: "Task updated successfully",
      planner,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// UPDATE planner
const updatePlanner = async (req, res) => {
  try {
    const { title, subject, weekStart, weekEnd, tasks } = req.body;

    const planner = await WeeklyPlanner.findOne({
      _id: req.params.plannerId,
      user: req.user.id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found",
      });
    }

    planner.title = title;
    planner.subject = subject;
    planner.weekStart = weekStart;
    planner.weekEnd = weekEnd;
    planner.tasks = tasks;

    await planner.save();

    res.status(200).json({
      message: "Planner updated successfully",
      planner,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update planner",
    });
  }
};

// DELETE chapter
const deletePlanner = async (req, res) => {
  try {
    const planner = await WeeklyPlanner.findOneAndDelete({
      _id: req.params.plannerId,
      user: req.user.id,
    });

    if (!planner) {
      return res.status(404).json({
        message: "Planner not found",
      });
    }

    res.status(200).json({
      message: "Planner deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete planner",
    });
  }
};

module.exports = {
  getPlanner,
  createPlanner,
  updatePlannerTask,
  updatePlanner,
  deletePlanner,
};