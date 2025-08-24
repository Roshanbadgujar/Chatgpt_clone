const messageModel = require('../models/message.model');

exports.createMessage = async (userId, chatId, message, sender) => {
    try {
        const newMessage = new messageModel({
            user : userId,
            chatId,
            message,
            sender
        });
        await newMessage.save();
        return newMessage;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getMessages = async (userId, chatId) => {
    try {
        const messages = await messageModel.findOne({ user: userId, chatId: chatId });
        return messages;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updateMessage = async (messageId, message) => {
    try {
        const updatedMessage = await messageModel.findByIdAndUpdate(messageId, { message: message }, { new: true });
        return updatedMessage;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.deleteMessage = async (messageId) => {
    try {
        const deletedMessage = await messageModel.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            throw new Error('Message not found');
        }
        return {
            message: 'Message deleted successfully',
        }
    } catch (error) {
        throw new Error(error.message);
    }
}