///////
// File Explanation
////
// Controls user creation


///////
// Dependencies
////
const bcrypt = require('bcrypt')
const express = require('express')
const userRouter = express.Router()
const User = require('../models/user.js')

///////
// Controller Middleware
////


///////
// Controller Routes
////

// Remember INDUCES
userRouter.get('/new', (req, res) => {
    try {
        if(req.session.currentUser) {
            res.redirect('/')
        }
        res.render('users/new.ejs', {
            currentUser: req.session.currentUser
        })
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})

userRouter.post('/', async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        const newUser = await User.create(req.body)
        req.session.currentUser = newUser
        res.redirect('/')
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})


///////
// Exports
////
module.exports = userRouter