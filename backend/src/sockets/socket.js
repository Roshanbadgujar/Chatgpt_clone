const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const messageController = require('../controllers/message.controller')

function socket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decode.id);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user; 

      next();
    } catch (err) {
      console.error('Socket auth error:', err.message);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('ai-message', async (message) => {
        const response = await messageController.sendMessage(message, socket.user);
        socket.emit('ai-message', response);
    })
  });

  return io;
}

module.exports = socket;