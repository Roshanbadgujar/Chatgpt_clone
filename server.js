require('dotenv').config()
const httpServer = require('./src/app')
const connectToDb = require('./src/db/db')

connectToDb();

const Port = process.env.PORT || 3000

httpServer.listen(Port, () => {
    console.log(`server is running on ${Port}`)
})