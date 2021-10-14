///////
// File Explanation
////
// Controls post routing for all INDUCES routes, includes favorites/unfavorites, seed route, and delete all


///////
// Dependencies
////
const express = require('express')
const postRouter = express.Router()
const Post = require('../models/post.js')
const postSeed = require('../models/postSeed.js')
const User = require('../models/user.js')
const mongoose = require('mongoose')


///////
// Controller Middleware
////
// Ensures user is logged in, strict redirector
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


// Checks if user is the same user as the one who created the post, used for editing and deleting controls
const isSameUser = (req, res, next, post) => {
    // Passes true if same user as post
    if (!req.session.currentUser) return false
    if (req.session.currentUser._id == post.author._id) return true
    return false
}


// Ensures user is admin, strict redirector
const isAdminStrict = (req, res, next) => {
    // Sends error if not admin
    try {
        if (!req.session.currentUser.admin) {
            throw new Error('Administrator operation only.')
        }
        next()
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
}


// Checks if user is admin, used for editing and deleting controls
const isAdminValue = (req, res, next) => {
    // Passes true if admin
    if (!req.session.currentUser) return false
    if (req.session.currentUser.admin) return true
    return false
}


// Sanitizes data on new posts or post updates
const dataSanitize = (req, res, next) => {
    // Sanitizes data based on content
    const postObj = {}
    postObj.name = req.body.name
    postObj.author = req.session.currentUser._id
    postObj.contentType = req.body.contentType
    postObj.description = req.body.description

    const contObj = {}
    switch (req.body.contentType) {
        case 'general':
            contObj.name = req.body.genName
            contObj.description = req.body.genDescription
            contObj.features = req.body.genFeatures
            break
        case 'item':
            contObj.name = req.body.itemName
            contObj.description = req.body.itemDescription
            contObj.itemType = req.body.itemType
            contObj.rarity = req.body.itemRarity
            contObj.wondrous = !!req.body.itemWondrous
            contObj.attunement = !!req.body.itemAttune
            // Can condense this by changing itemType to a number
            switch (req.body.itemType) {
                case 'offensive':
                    contObj.damage = req.body.itemDamage
                    contObj.effects = req.body.itemEffects[0]
                    contObj.weight = req.body.itemWeight[0]
                    contObj.value = req.body.itemValue[0]
                    break
                case 'defensive':
                    contObj.ac = req.body.itemAc
                    contObj.effects = req.body.itemEffects[1]
                    contObj.weight = req.body.itemWeight[1]
                    contObj.value = req.body.itemValue[1]
                    break
                case 'misc':
                    contObj.effects = req.body.itemEffects[2]
                    contObj.weight = req.body.itemWeight[2]
                    contObj.value = req.body.itemValue[2]
                    break
            }
            break
    }
    postObj.content = contObj
    return postObj
}


///////
// Controller Routes
////
// Seed route -- Include for demonstration purposes
postRouter.post('/seed', isAdminStrict, async (req, res, next) => {
    try {
        await Post.create(postSeed, {
            author: req.session.currentUser._id
        })
        res.redirect('/posts')
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})


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


// Delete ALL
postRouter.delete('/all', isUser, isAdminStrict, async (req, res) => {
    try {
        await Post.deleteMany({})
        window.location.href = '/posts'
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
        window.location.href = '/posts'
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
        // Passes contentType to data sanitization
        const postToUpdate = await Post.findById(req.params.id)
        req.body.contentType = postToUpdate.contentType
        // Ensures that the author stays the same
        const updatedObject = dataSanitize(req, res, next)
        updatedObject.author = postToUpdate.author
        await Post.findByIdAndUpdate(
            req.params.id, updatedObject
            )
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
        const createdPost = await Post.create(postObj)
        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $push: {
                'postIds': createdPost._id
            }
        })
        req.session.currentUser.postIds.push(createdPost._id)
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
        const adminUser = isAdminValue(req, res, next)
        res.render('posts/show.ejs', {
            currentUser: req.session.currentUser,
            post: foundPost,
            sameUser,
            adminUser
        })
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})


// Favorite
postRouter.get('/:id/favorite', async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $push: {
                'favoriteIds': mongoose.Types.ObjectId(req.params.id)
            }
        })
        await Post.findByIdAndUpdate(req.params.id, {
            $inc: {favorites: 1}
        })
        req.session.currentUser.favoriteIds.push(req.params.id)
        res.redirect('/posts')
    } catch (error) {
        res.render('error.ejs', {
            currentUser: req.session.currentUser,
            error
        })
    }
})


// Unfavorite
postRouter.get('/:id/unfavorite', async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $pull: {
                'favoriteIds': mongoose.Types.ObjectId(req.params.id)
            }
        })
        await Post.findByIdAndUpdate(req.params.id, {
            $inc: {favorites: -1}
        })
        req.session.currentUser.favoriteIds.splice(req.session.currentUser.favoriteIds.indexOf(req.params.id), 1)
        res.redirect('/posts')
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