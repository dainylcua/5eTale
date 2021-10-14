///////
// Dependencies
////
const express = require('express')
const mainRouter = express.Router()
const User = require('../models/user.js')
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


///////
// Controller Routes
////
mainRouter.get('/', (req, res) => {
    res.render('index.ejs', {
        currentUser: req.session.currentUser
    })
})


mainRouter.get('/dashboard', isUser, async (req, res) => {
    try {
        const userFavs = await Post.find({'_id': {$in: req.session.currentUser.favoriteIds}}).populate('author','username')
        const userPosts = await Post.find({'_id': {$in: req.session.currentUser.postIds}}).populate('author','username')
        const userCollections = await Post.find({'_id': {$in: req.session.currentUser.collectionIds}}).populate('author','username')
        res.render('dashboard.ejs', {
            currentUser: req.session.currentUser,
            userFavs,
            userPosts,
            userCollections
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
module.exports = mainRouter