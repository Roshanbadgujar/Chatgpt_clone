const userService = require('../services/user.service');

exports.register = async (req, res) => {
    try {
        const userData = req.body
        const user = await userService.register(userData)
        res.status(201).json(user)
    } catch (error) {
        throw new Error(error.message);
    }
}