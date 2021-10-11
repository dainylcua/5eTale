///////
// Dependencies
////
const express = require('express')
const postRouter = express.Router()
const Post = require('../models/post.js')

///////
// Controller Middleware
////
const isUser = (req, res, next) => {
    try {
        if (!req.session.currentUser) {
            throw new Error('Please log in to continue.')
        }       
        next()
    } catch (error) {
        res.render('error.ejs', { 
            currentUser: req.session.currentUser,
            error})
    }
}

///////
// Controller Routes
////

// Remember INDUCES

// Index
postRouter.get('/', async (req,res) => {

})

// New
postRouter.get('/create', isUser, async (req, res) => {
    try {
        res.render('posts/new.ejs', {
            currentUser: req.session.currentUser
        })
    } catch (error) {
        res.render(`hoi ${error}`)
    }
})

// Delete
postRouter.delete('/', async (req, res) => {

})

// Update
postRouter.put('/', async (req, res) => {

})


// Create
postRouter.post('/', async (req, res) => {

})


// Edit
postRouter.get('/:id/edit', async (req, res) => {

})

// Show
postRouter.get('/:id', async (req, res) => {

})

///////
// Exports
////
module.exports = postRouter