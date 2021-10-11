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
            error
        })
    }
}

const isSameUser = (req, res, next) => {

}

const dataSanitize = (req, res, next) => {
    const postObj = {}
    postObj.name = req.body.postName
    postObj.author = req.session.currentUser._id
    postObj.contentType = req.body.contentType

    const contObj = {}
    switch (req.body.contentType) {
        case 'general':
            contObj.name = req.body.genName
            contObj.features = req.body.genFeatures
            break
    }
    postObj.content = contObj
    return postObj
}

///////
// Controller Routes
////

// Remember INDUCES

// Index
postRouter.get('/', async (req, res) => {
    try {
        const postList = await Post.find({})
        res.send(postList)
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})

// New
postRouter.get('/create', isUser, (req, res) => {
    try {
        res.render('posts/new.ejs', {
            currentUser: req.session.currentUser
        })
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})

// Delete
postRouter.delete('/', async (req, res) => {

})

// Update
postRouter.put('/', async (req, res) => {

})


// Create
postRouter.post('/', async (req, res, next) => {
    try {
        const postObj = dataSanitize(req, res, next)
        const newPost = await Post.create(postObj)
        res.redirect('/posts')
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
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