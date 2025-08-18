const monoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new monoose.Schema({
    fullName : {
        firstName : {
            type : String,
        },
        lastName : {
            type : String
        }
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
})

userSchema.pre('save', async function(next){
    const user = this;
    const salt = await bcrypt.genSalt(10);
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, salt)
    }
    next();
})

userSchema.methods.comparePassword = async function(candidatePassword){
    const user = this;
    return bcrypt.compare(candidatePassword, user.password)
}

const userModel = monoose.model('User', userSchema);

module.exports = userModel;