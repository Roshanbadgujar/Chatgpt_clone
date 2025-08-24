const chatService = require('../services/chat.service');

exports.createChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatName } = req.body;
        const createdChat = await chatService.createChat(userId, chatName);
        res.status(201).json(createdChat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await chatService.getChats(userId);
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { chatName }  = req.body;
        const updatedChat = await chatService.updateChat(chatId, chatName);
        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        await chatService.deleteChat(chatId);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}