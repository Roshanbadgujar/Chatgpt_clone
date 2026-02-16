const userService = require('../services/user.service');

const mapAuthErrorStatus = (message = '') => {
  if (message.includes('already exists')) return 409;
  if (message.includes('All fields are required') || message.includes('User data is required')) return 400;
  if (message.includes('Invalid email or password') || message.includes('User not found')) return 401;
  return 500;
};

exports.register = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.register(userData);
    res.status(201).json(user);
  } catch (error) {
    const statusCode = mapAuthErrorStatus(error.message);
    res.status(statusCode).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.login(userData);
    res.status(200).json(user);
  } catch (error) {
    const statusCode = mapAuthErrorStatus(error.message);
    res.status(statusCode).json({ error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
