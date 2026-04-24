const express = require('express');
const authController = require('../controllers/auth.controller');
const { authUser } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);

router.get('/user', authUser, authController.getUser);

router.post('/login', authController.loginUser);

router.post('/logout', authController.logoutUser);



module.exports = router;