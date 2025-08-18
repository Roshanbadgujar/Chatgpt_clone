const mongoose = require('mongoose')

function connectToDb() {
    mongoose.connect(process.env.MONOGDB_URI)
    .then(() => {
        console.log('db is live')
    }).catch((err) => {
        console.log(err)
    })
}

module.exports = connectToDb;