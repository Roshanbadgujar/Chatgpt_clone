require('dotenv').config()
const app = require('./src/app')
const connectToDb = require('./src/db/db')

connectToDb();

const Port = process.env.PORT || 3000

app.listen(Port, () => {
    console.log(`server is running on ${Port}`)
})