const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (userData) => {
    try {
        if (!userData) {
            throw new Error('User data is required');
        }
        if(!userData.fullName || !userData.email || !userData.password){
            throw new Error("All fields are required");
        }
        const existingUser = await userModel.findOne({email : userData.email});
        if(existingUser){
            throw new Error("User already exists");
        }
        const user = await userModel.create(userData);
        if(!user) {
            throw new Error('Something went wrong');
        }
        const token = jwt.sign({_id :  user._id}, process.env.JWT_SECRET)
        console.log(token);
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
        if(!user) {
            throw new Error('User not found');
        }
        const token = jwt.sign({_id :  userData._id}, process.env.JWT_SECRET)
        return {
            user,
            token
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getUserProfile = async (userId) =>  {
    try {
        const user = await userModel.findById(userId);
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}