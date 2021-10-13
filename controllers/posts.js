///////
// Dependencies
////
const express = require('express')
const postRouter = express.Router()
const Post = require('../models/post.js')
const postSeed = require('../models/postSeed.js')

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

const isAdmin = (req, res, next) => {
    try {
        if (!req.session.currentUser) {
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

const dataSanitize = (req, res, next) => {
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
            switch(req.body.itemType) {
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

// Remember INDUCES

// Seed route
postRouter.post('/seed', isUser, isAdmin, async (req, res, next) => {
    try {
        await Post.create(postSeed, {author: req.session.currentUser._id})
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
postRouter.delete('/all', isUser, isAdmin, async (req, res) => {
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
        const isAdmin = req.session.currentUser.admin
        res.render('posts/show.ejs', {
            currentUser: req.session.currentUser,
            post: foundPost,
            sameUser,
            isAdmin
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