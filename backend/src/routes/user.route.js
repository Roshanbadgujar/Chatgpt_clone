const express = require('express');
const userController = require('../controllers/user.controller'); 
const { protect }  = require('../middlewares/user.middleware');

const router = express.Router()

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile',protect, userController.getUserProfile);

module.exports = router
