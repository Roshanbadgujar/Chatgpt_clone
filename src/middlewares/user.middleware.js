const jwt = require('jsonwebtoken')
const user = require('../models/user.model')

async function protect(req, res, next) {
    const bearer = req.headers.authorization
    if (!bearer || !bearer.startsWith('Bearer ')) {
        res.status(401)
        res.send('Unauthorized')
        return
    }
    const token = bearer.split(' ')[1].trim()
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const userData = await user.findById(payload.id)
        req.user = userData
        next() 
        return
    } catch (e) {
        res.status(401)
        res.send({error : e.message})
        return
    }
}

module.exports = {protect};