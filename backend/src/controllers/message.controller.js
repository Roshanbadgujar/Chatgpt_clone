const messageService = require('../services/message.service');
const chatService = require('../services/chat.service');
const chatModel = require('../models/chat.model');
const ai = require('../config/ai');

const buildUserContext = (user, meta = {}) => {
  const memoryHints = Array.isArray(meta.memoryHints) ? meta.memoryHints.slice(0, 5) : [];

  return {
    userName: user?.fullName?.firstName || user?.name,
    voiceMode: Boolean(meta.voiceMode),
    isPremium: Boolean(meta.isPremium),
    memoryHints,
  };
};

exports.sendMessage = async (messages, user) => {
  try {
    let { chatId, message, meta = {} } = messages;
    const userId = user._id;

    if (!userId || !message) {
      throw new Error('All fields are required');
    }

    const getMessages = await messageService.getMessages(userId, chatId);

    let chatTitles = null;
    if (chatId) {
      const getChat = await chatModel.findOne({ _id: chatId });
      if (getChat) {
        chatTitles = getChat.chatName;
      } else {
        throw new Error('Chat not found');
      }
    }

    const messageArray = getMessages.map((msg) => ({
      role: msg.role,
      content: msg.message,
      time: msg.timestamp,
    }));

    const botResponse = await ai(message, messageArray, chatTitles, buildUserContext(user, meta));

    if (!chatId) {
      const newChat = await chatService.createChat(userId, botResponse.title || 'New Chat');
      chatId = newChat._id;
    }

    if (!botResponse?.reply) {
      throw new Error('AI reply not found');
    }

    const response = {
      chatId,
      message: botResponse.reply,
      sender: 'model',
    };

    if (botResponse.title) {
      response.title = botResponse.title;
    }

    await Promise.all([
      messageService.createMessage(userId, chatId, message, 'user'),
      messageService.createMessage(userId, chatId, botResponse.reply, 'model'),
    ]);

    return response;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatId = req.params.chatId;
    if (!userId || !chatId) {
      throw new Error('All fields are required');
    }
    const messagesData = await messageService.getMessages(userId, chatId);
    const messages = messagesData.map((msg) => ({
      sender: msg.role,
      text: msg.message,
      time: msg.timestamp,
    }));
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
