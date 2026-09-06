const express = require("express");

const router = express.Router();

const weeklyPlannerController = require("../controllers/weeklyPlanner.controller");

const { authUser } = require("../middleware/auth.middleware");

router.get(
  "/weekly-planner",
  authUser,
  weeklyPlannerController.getPlanner
);

router.post(
  "/weekly-planner",
  authUser,
  weeklyPlannerController.createPlanner
);

router.patch(
  "/weekly-planner/:id/task/:taskId",
  authUser,
  weeklyPlannerController.updatePlannerTask
);

router.delete(
  "/weekly-planner/:id",
  authUser,
  weeklyPlannerController.deletePlanner
);

module.exports = router;