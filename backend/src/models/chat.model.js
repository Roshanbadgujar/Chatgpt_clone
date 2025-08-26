const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chatName : {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const chatModel = mongoose.model("Chat", chatSchema)

module.exports = chatModel