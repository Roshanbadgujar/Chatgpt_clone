const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    return user;
};


const userModel = mongoose.model('user', userSchema);

module.exports = userModel;