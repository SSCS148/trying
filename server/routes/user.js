const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/check-email', userController.checkEmail);
router.get('/all', userController.getAllUsers);
router.post('/refresh-token', userController.refreshToken);

module.exports = router;