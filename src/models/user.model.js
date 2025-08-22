const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password'))return next()
    const genSalt = bcrypt.genSaltSync(10)
    bcrypt.hash(user.password, genSalt, (err, hash) => {
        if (err) return next(err)
        user.password = hash
        next()
    })
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;