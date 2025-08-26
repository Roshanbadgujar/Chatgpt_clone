const chatModel = require('../models/chat.model');

exports.createChat = async (user, chatName) => {
    try {
        if (!user) {
            throw new Error('Invalid input');
        }
        console.log(chatName);
        const createdChat = await chatModel.create({
            user,
            chatName : chatName,
        });
        return createdChat;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getChats = async (userId) => {
    try {
        if (!userId) {
            throw new Error('Invalid input');
        }
        const chats = await chatModel.find({ user: userId });
        return chats;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updateChat = async (chatId, chatName) => {
    try {
        if (!chatId || !chatName) {
            throw new Error('Invalid input');
        }
        const updatedChat = await chatModel.findByIdAndUpdate(chatId, { chatName }, { new: true });
        if (!updatedChat) {
            throw new Error('Chat not found');
        }
        return updatedChat;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.deleteChat = async (chatId) => {
    try {
        if (!chatId) {
            throw new Error('Invalid input');
        }
        const deletedChat = await chatModel.findByIdAndDelete(chatId);
        if (!deletedChat) {
            throw new Error('Chat not found');
        }
    } catch (error) {
        throw new Error(error.message);
    }
}