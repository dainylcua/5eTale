///////
// Dependencies
////
const bcrypt = require('bcrypt')
const express = require('express')
const sessionRouter = express.Router()
const User = require('../models/user.js')

///////
// Controller Middleware
////


///////
// Controller Routes
////

// Remember INDUCES
sessionRouter.post('/', async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username })
        if (!foundUser || !bcrypt.compareSync(req.body.password, foundUser.password)) {
            throw new Error('Invalid credentials')
        }
        req.session.currentUser = foundUser
        res.redirect('/') 
    } catch (error) {
        res.send(`hoi ${error}`)
    }
})

sessionRouter.get('/new', (req, res) => {
    res.render('sessions/new.ejs', {
        currentUser: req.session.currentUser
    })
})

sessionRouter.delete('/', async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        res.send(`hoi ${error}`)
    }
})

///////
// Exports
////
module.exports = sessionRouter