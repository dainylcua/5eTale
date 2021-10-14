///////
// File Explanation
////
// Controls session creation and destruction


///////
// Dependencies
////
const bcrypt = require('bcrypt')
const express = require('express')
const sessionRouter = express.Router()
const User = require('../models/user.js')

///////
// Controller Routes
////

// Handles login request
sessionRouter.post('/', async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username })
        if (!foundUser || !bcrypt.compareSync(req.body.password, foundUser.password)) {
            throw new Error('Invalid credentials')
        }
        req.session.currentUser = foundUser
        res.redirect('/') 
    } catch (error) {
        res.render('sessions/new.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})


// Handles login
sessionRouter.get('/new', (req, res) => {
    try {
        if(req.session.currentUser) {
            res.redirect('/')
        }
        res.render('sessions/new.ejs', {
            currentUser: req.session.currentUser,
            error: null,
        })
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})


// Handles logout
sessionRouter.delete('/', async (req, res) => {
    try {
        req.session.destroy()
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
module.exports = sessionRouter