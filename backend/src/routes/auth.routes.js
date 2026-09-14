const express = require("express");
const authController = require("../controllers/auth.controller");
const { authUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/api/register", authController.register);

router.get("/api/user", authUser, authController.getUser);

router.post("/api/login", authController.loginUser);

router.post("/api/logout", authController.logoutUser);

router.get("/api/me", authUser, authController.getMe);

module.exports = router;
