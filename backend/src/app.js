const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const userRoutes = require('../src/routes/user.route');
const chatRoutes = require('../src/routes/chat.route');
const messageRoutes = require('../src/routes/message.route');
const thirdPartyRoutes = require('../src/routes/thirdParty.route');
const healthRoutes = require('../src/routes/health.route');
const socket = require('../src/sockets/socket');

const app = express();
const httpServer = createServer(app);

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
const fallbackPublicPath = path.join(__dirname, '../public');
const staticPath = fs.existsSync(frontendDistPath) ? frontendDistPath : fallbackPublicPath;

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);

socket(httpServer);

app.use(express.json());
app.use(express.static(staticPath));

app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/integrations', thirdPartyRoutes);
app.use('/api/health', healthRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

module.exports = httpServer;
