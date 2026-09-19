const express = require("express");
const taskController = require("../controllers/task.controller");
// const daytaskCo = require("../controllers/daytask.controller");
const { authUser } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/task", authUser, taskController.createTask);
router.get("/task", authUser, taskController.getTasks);
router.get("/task/:id", authUser, taskController.getTaskById);
router.patch(
  "/task/:plannerId/task/:taskId",
  authUser,
  taskController.updateTaskStatus,
);
router.put("/task/:id", authUser, taskController.updateTasks);
router.delete("/task/:id", authUser, taskController.deleteTasks);
// router.post("/createtask", authUser, daytaskCo.createTask);
// router.get("/getdaytasks", daytaskCo.getTasks);
// router.get("/getdaytaskby/:id", authUser, daytaskCo.getTaskById);
// router.delete("/deletetask/:id", authUser, daytaskCo.deleteTasks);
// router.put("/updatetask/:id", authUser, daytaskCo.updateTasks);
// router.put("/updatetaskstatus/:id/done", authUser, daytaskCo.updateTaskStatus);
// router.delete("/deletealltasks", authUser, daytaskCo.deleteAllTasks);
module.exports = router;
