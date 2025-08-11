module.exports = (...allowedRoles) => {
    return (req,res,next) => {
        if(!allowedRoles) return res.status(403).json({error: 'You are not allowed'})
        next()
    }
}