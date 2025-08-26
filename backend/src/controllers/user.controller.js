const userService = require('../services/user.service');

exports.register = async (req, res) => {
    try {
        const userData = req.body
        const user = await userService.register(userData)
        res.status(201).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({error : error.message});
    }
}

exports.login = async (req, res) => {
    try {
        const userData = req.body
        const user = await userService.login(userData)
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user._id)
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}