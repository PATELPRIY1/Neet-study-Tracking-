const express = require("express");
const taskController = require("../controllers/task.controller");
const daytaskCo = require("../controllers/daytask.controller");
const { authUser } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/create-task", authUser, taskController.createTask);
router.get("/get-task", authUser, taskController.getTasks);
router.get("/get-task-by/:id", authUser, taskController.getTaskById);
router.put("/update-task/:id", authUser, taskController.updateTasks);
router.put(
  "/update-task-status/:id/status",
  authUser,
  taskController.updateTaskStatus,
);
router.delete("/delete-task/:id", authUser, taskController.deleteTasks);
router.delete("/delete-all-tasks", authUser, taskController.deleteAllTasks);
router.post("/createtask", authUser, daytaskCo.createTask);
router.get("/getdaytasks", daytaskCo.getTasks);
router.get("/getdaytaskby/:id", authUser, daytaskCo.getTaskById);
router.delete("/deletetask/:id", authUser, daytaskCo.deleteTasks);
router.put("/updatetask/:id", authUser, daytaskCo.updateTasks);
router.put("/updatetaskstatus/:id/done", authUser, daytaskCo.updateTaskStatus);
router.delete("/deletealltasks", authUser, daytaskCo.deleteAllTasks);

module.exports = router;
