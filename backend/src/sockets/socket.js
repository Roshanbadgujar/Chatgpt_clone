const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const messageController = require('../controllers/message.controller');
const thirdPartyService = require('../services/thirdParty.service');

function socket(httpServer) {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

  const io = new Server(httpServer, {
    cors: {
      origin: frontendOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socketInstance, next) => {
    try {
      const token = socketInstance.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decode.id);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socketInstance.user = user;
      socketInstance.join(`user:${user._id}`);

      next();
    } catch (err) {
      console.error('Socket auth error:', err.message);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socketInstance) => {
    socketInstance.on('join-chat', (chatId) => {
      if (chatId) {
        socketInstance.join(`chat:${chatId}`);
      }
    });

    socketInstance.on('leave-chat', (chatId) => {
      if (chatId) {
        socketInstance.leave(`chat:${chatId}`);
      }
    });

    socketInstance.on('typing', ({ chatId, isTyping }) => {
      if (!chatId) return;
      socketInstance.to(`chat:${chatId}`).emit('typing', {
        chatId,
        isTyping: Boolean(isTyping),
        userId: socketInstance.user._id,
      });
    });

    socketInstance.on('fetch-companion-spark', async () => {
      const spark = await thirdPartyService.getCompanionSpark();
      socketInstance.emit('companion-spark', spark);
    });

    socketInstance.on('ai-message', async (message) => {
      try {
        const response = await messageController.sendMessage(message, socketInstance.user);
        socketInstance.emit('ai-message', response);

        if (response.chatId) {
          socketInstance.to(`chat:${response.chatId}`).emit('new-message', response);
        }
      } catch (error) {
        socketInstance.emit('ai-error', {
          error: error.message || 'Something went wrong',
        });
      }
    });
  });

  return io;
}

module.exports = socket;
