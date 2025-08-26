const express = require('express');
const { protect } = require('../middlewares/user.middleware');
const chatController = require('../controllers/chat.controller');
 
const router = express.Router();

router.use(protect);
 
// router.post('/chat', chatController.createChat);
router.get('/chat', chatController.getChats);
router.put('/chat/:chatId', chatController.updateChat);
router.delete('/chat/:chatId', chatController.deleteChat);
 
module.exports = router;