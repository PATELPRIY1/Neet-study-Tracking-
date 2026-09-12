const express = require("express");

const router = express.Router();

const weeklyPlannerController = require("../controllers/weeklyPlanner.controller");

const { authUser } = require("../middleware/auth.middleware");

router.get("/weekly-planner", authUser, weeklyPlannerController.getPlanner);
router.post("/weekly-planner", authUser, weeklyPlannerController.createPlanner);
router.patch(
  "/weekly-planner/:plannerId/:taskId",
  authUser,
  weeklyPlannerController.updateTask,
);
router.delete(
  "/weekly-planner/:plannerId",
  authUser,
  weeklyPlannerController.deletePlanner,
);
router.put(
  "/weekly-planner/:plannerId",
  authUser,
  weeklyPlannerController.updatePlanner,
);

module.exports = router;
