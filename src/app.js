const express = require('express');
const userRoutes = require('../src/routes/user.route')

const app = express()

app.use(express.json())


app.use('/api/auth', userRoutes)

module.exports = app;