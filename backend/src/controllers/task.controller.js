const taskModel = require("../models/task.model");

const createTask = async (req, res) => {
  try {
    const {
      subject,
      topic,
      status = "pending",
      createdAt = new Date(),
    } = req.body;
    const userId = req.user.id;

    const taskData = { userId, subject, topic, status };

    // If createdAt is provided in the request, use it; otherwise, Database will use current date
    if (createdAt) {
      taskData.createdAt = new Date(createdAt);
    }

    const task = await taskModel.create(taskData);

    res.status(201).json({
      message: "Task created successfully",
      task: {
        subject: task.subject,
        topic: task.topic,
        status: task.status,
        createdAt: task.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await taskModel.find({ userId });
    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: tasks,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving tasks", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.status(200).json({
      message: "Task retrieved successfully",
      task: task,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving task", error: error.message });
  }
};

const updateTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedTask = await taskModel.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Task updated successfully",
      task: {
        subject: updatedTask.subject,
        topic: updatedTask.topic,
        status: updatedTask.status,
        createdAt: updatedTask.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await taskModel.findByIdAndDelete(taskId);
    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

const deleteAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    await taskModel.deleteMany({ userId });
    res.status(200).json({
      message: "All tasks deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting tasks", error: error.message });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true },
    );
    res.status(200).json({
      message: "Task status updated successfully",
      task: {
        subject: updatedTask.subject,
        topic: updatedTask.topic,
        status: updatedTask.status,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task status", error: error.message });
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
