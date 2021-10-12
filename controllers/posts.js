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

const isSameUser = (req, res, next, post) => {
    if(!req.session.currentUser) return false
    if(req.session.currentUser._id == post.author._id) return true
    return false
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
        const postList = await Post.find({}).populate('author', 'username')
        res.render('posts/index.ejs', {
            currentUser: req.session.currentUser,
            posts: postList
        })
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
postRouter.delete('/:id', isUser, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.redirect('/posts')
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})

// Update
postRouter.put('/:id', isUser, async (req, res, next) => {
    try {
        dataSanitize(req, res, next)
        // TODO: General only for now, update for all types
        await Post.findByIdAndUpdate(
            req.params.id,
            {
                'content.name': req.body.genName,
                'content.features': req.body.genFeatures
            })
        res.redirect(`/posts/${req.params.id}`)
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})


// Create
postRouter.post('/', isUser, async (req, res, next) => {
    try {
        const postObj = dataSanitize(req, res, next)
        await Post.create(postObj)
        res.redirect('/posts')
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})


// Edit
postRouter.get('/:id/edit', isUser, async (req, res) => {
    try {
        const foundPost = await Post.findById(req.params.id)
        res.render('posts/edit.ejs', {
            currentUser: req.session.currentUser,
            post: foundPost
        })
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})

// Show
postRouter.get('/:id', async (req, res, next) => {
    try {
        const foundPost = await Post.findById(req.params.id).populate('author', 'username')
        const sameUser = isSameUser(req, res, next, foundPost)
        res.render('posts/show.ejs', {
            currentUser: req.session.currentUser,
            post: foundPost,
            sameUser
        })
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
module.exports = postRouter