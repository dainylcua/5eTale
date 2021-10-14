///////
// File Explanation
////
// Controls api requests, returns a json object


///////
// Dependencies
////
const apiRouter = require('express').Router()
const Post = require('../models/post.js')


///////
// Controller Routes
////
// Index
apiRouter.get('/', async (req,res) => {
    try {
        const foundPosts = await Post.find({}).populate('author', 'username')
        res.json(foundPosts)
    } catch (error) {
        res.json({
            failed: true,
            message: 'Error fetching posts',
            errmess: error
        })
    }
})


// Show
apiRouter.get('/:id', async (req, res) => {
    try {
        const foundPosts = await Post.findById(req.params.id).populate('author', 'username')
        res.json(foundPosts)
    } catch (error) {
        res.json({
            failed: true,
            message: 'Error fetching post',
            errmess: error
        })
    }
})


///////
// Exports
////
module.exports = apiRouter