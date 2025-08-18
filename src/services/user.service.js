const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (userData) => {
    try {
        const user = await userModel.create(userData);
        if(!user) {
            throw new Error('Something went wrong');
        }
        const token = jwt.sign({_id :  user._id})
        return {
            user,
            token
        }
    } catch (error) {
        throw new Error(error.message);   
    }
}

exports.login = async (userData) => {
    try {
        const user = await userModel.findOne(userData);
        const token = jwt.sign({_id :  userData._id})
        return {
            user,
            token
        }
    } catch (error) {
        throw new Error(error.message);
    }
}
