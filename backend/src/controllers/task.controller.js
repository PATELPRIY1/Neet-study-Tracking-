const taskModel = require("../models/task.model");

// ==============================
// CREATE CHAPTER
// ==============================
const createTask = async (req, res) => {
  try {
    const { subject, date, tasks } = req.body;
    const userId = req.user.id;

    if (!subject) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const task = await taskModel.create({
      userId,
      subject,
      date,
      tasks: Array.isArray(tasks) ? tasks : [],
    });

    res.status(201).json({
      message: "Chapter created successfully",
      planner: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Error creating chapter",
      error: error.message,
    });
  }
};

// ==============================
// GET ALL CHAPTERS
// ==============================
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await taskModel
      .find({ userId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Error retrieving tasks",
      error: error.message,
    });
  }
};

// ==============================
// GET CHAPTER BY ID
// ==============================
const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await taskModel.findOne({
      _id: taskId,
      userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    console.error("Get task by ID error:", error);

    res.status(500).json({
      message: "Error retrieving task",
      error: error.message,
    });
  }
};

// ==============================
// UPDATE CHAPTER
// ==============================
const updateTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const { subject, date, tasks } = req.body;

    const task = await taskModel.findOne({
      _id: taskId,
      userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (subject !== undefined) {
      task.subject = subject;
    }

    if (date !== undefined) {
      task.date = date;
    }

    if (Array.isArray(tasks)) {
      task.tasks = tasks;
    }

    await task.save();

    res.status(200).json({
      message: "Chapter updated successfully",
      planner: task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Error updating chapter",
      error: error.message,
    });
  }
};

// ==============================
// UPDATE NESTED TASK STATUS
// ==============================
const updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const { plannerId, taskId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "half",
      "completed",
      "missed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const taskDoc = await taskModel.findOne({
      _id: plannerId,
      userId,
    });

    if (!taskDoc) {
      return res.status(404).json({
        message: "Chapter not found",
      });
    }

    const nestedTask = taskDoc.tasks.id(taskId);

    if (!nestedTask) {
      return res.status(404).json({
        message: "Checklist task not found",
      });
    }

    nestedTask.status = status;

    // Keep old completed field synchronized
    nestedTask.completed = status === "completed";

    await taskDoc.save();

    res.status(200).json({
      message: "Task status updated successfully",
      planner: taskDoc,
    });
  } catch (error) {
    console.error("Update task status error:", error);

    res.status(500).json({
      message: "Error updating task status",
      error: error.message,
    });
  }
};

// ==============================
// DELETE CHAPTER
// ==============================
const deleteTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await taskModel.findOneAndDelete({
      _id: taskId,
      userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// ==============================
// DELETE ALL CHAPTERS
// ==============================
const deleteAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    await taskModel.deleteMany({
      userId,
    });

    res.status(200).json({
      message: "All tasks deleted successfully",
    });
  } catch (error) {
    console.error("Delete all tasks error:", error);

    res.status(500).json({
      message: "Error deleting tasks",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTasks,
  updateTaskStatus,
  deleteTasks,
  deleteAllTasks,
};