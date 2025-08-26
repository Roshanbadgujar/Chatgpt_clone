const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect }  = require('../middlewares/user.middleware');

router.use(protect);

router.get('/messages/:chatId', messageController.getMessages);

module.exports = router;