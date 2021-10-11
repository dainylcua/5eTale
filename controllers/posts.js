///////
// Dependencies
////
const express = require('express')
const postRouter = express.Router()
const Post = require('../models/post.js')

///////
// Controller Middleware
////


///////
// Controller Routes
////

// Remember INDUCES

// Index
postRouter.get('/', async (req,res) => {

})

// New
postRouter.get('/create', async (req, res) => {
    try {
        
    } catch (error) {
        
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