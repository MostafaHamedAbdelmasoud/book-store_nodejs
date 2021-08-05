
const checkAuthenticated = (req, res, next)=> {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/register')
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    // console.log(req.isAuthenticated())
    next()
}

module.exports = {checkNotAuthenticated,checkAuthenticated}