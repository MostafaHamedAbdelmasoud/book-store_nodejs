var express = require('express');
var router = express.Router();
const User = require('../models/user')

/* GET users listing. */

router.post('/', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        console.log('heelo there')
        res.render('index')
    } catch (e) {
        res.send(e)
        res.render('register')
    }
})

router.get('/register', async (req, res) => {
    res.render('register', {layout: 'layouts/Auth_layout'});

})

module.exports = router;
