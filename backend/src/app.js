const express = require('express');
const { createServer } = require('http');
const userRoutes = require('../src/routes/user.route')
const chatRoutes = require('../src/routes/chat.route')
const messageRoutes = require('../src/routes/message.route')
const cors = require('cors')
const socket = require('../src/sockets/socket')

const app = express()
const httpServer = createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

socket(httpServer);

app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

module.exports = httpServer;