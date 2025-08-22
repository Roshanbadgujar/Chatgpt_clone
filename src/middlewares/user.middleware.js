const jwt = require('jsonwebtoken')

function protect(req, res, next) {
    const bearer = req.headers.authorization
    if (!bearer || !bearer.startsWith('Bearer ')) {
        res.status(401)
        res.send('Unauthorized')
        return
    }
    const token = bearer.split(' ')[1].trim()
    try {
        const payload = jwt.verify(token, process.env.SECRET)
        req.user = payload
        next() 
        return
    } catch (e) {
        res.status(401)
        res.send({error : e.message})
        return
    }
}

module.exports = {protect};