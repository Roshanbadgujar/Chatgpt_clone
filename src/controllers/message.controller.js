const messageService = require('../services/message.service');
const ai = require('../config/ai')

exports.sendMessage = async (messages, user) => {
    try {
        const { chatId, message } = messages;
        const userId = user._id;
         if (!chatId || !userId || !message) {
            throw new Error("All fields are required");
        }
        const botResponse = await ai(message);
        await messageService.createMessage(userId, chatId, message);
        const botMessage = await messageService.createMessage(userId, chatId, botResponse, 'bot');
        const response = {
            message : botMessage.message,
            chatId : chatId,
        }
        return response;
    } catch (error) {
        console.log(error);
    }
}

exports.getMessages = async (userId, chatId) => {
    try {
        if (!userId || !chatId) {
            throw new Error("All fields are required");
        }
        const messages = await messageService.getMessages(userId, chatId);
        return messages;
    } catch (error) {
        throw new Error(error.message);
    }
}