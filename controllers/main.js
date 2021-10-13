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

mainRouter.get('/dashboard', isUser, async (req, res) => {
    try {
        const userFavs = await Post.find({'_id': {$in: req.session.currentUser.favoriteIds}})
        const userPosts = await Post.find({'_id': {$in: req.session.currentUser.postIds}})
        const userCollections = await Post.find({'_id': {$in: req.session.currentUser.collectionIds}})
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