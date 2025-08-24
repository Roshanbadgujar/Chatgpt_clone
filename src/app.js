const express = require('express');
const { createServer } = require('http');
const userRoutes = require('../src/routes/user.route')
const chatRoutes = require('../src/routes/chat.route')
const socket = require('../src/sockets/socket')

const app = express()
const httpServer = createServer(app);

socket(httpServer);

app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api/chat', chatRoutes)

module.exports = httpServer;