exports.getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'chatgpt-clone-backend',
    timestamp: new Date().toISOString(),
    features: {
      socket: ['ai-message', 'join-chat', 'leave-chat', 'typing', 'fetch-companion-spark'],
      routes: [
        '/api/auth/*',
        '/api/chat/*',
        '/api/message/*',
        '/api/integrations/companion-spark',
        '/api/health',
      ],
    },
  });
};
