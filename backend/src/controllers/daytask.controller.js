const express = require("express");
const taskModel = require("../models/140daytask.model");
const router = express.Router();

const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { day, biology, physics, chemistry, revision } = req.body;
    const newTask = new taskModel({
      userId,
      day,
      biology,
      physics,
      chemistry,
      revision,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await taskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { day, biology, physics, chemistry, revision } = req.body;
    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { day, biology, physics, chemistry, revision },
      { new: true },
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { done } = req.body;
    if (!done) {
      return res.status(400).json({ message: "Status is required" });
    }
    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { done },
      { new: true },
    );
    res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    await taskModel.deleteMany({ userId });
    res.status(200).json({ message: "All tasks deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  deleteTasks,
  updateTasks,
  updateTaskStatus,
  deleteAllTasks,
};
