///////
// Dependencies
////
const express = require('express')
const itemRouter = express.Router()
const Items = require('../models/item.js')

///////
// Controller Middleware
////


///////
// Controller Routes
////

// Remember INDUCES

// Index
itemRouter.get('/', async (req,res) => {

})

// New
itemRouter.get('/create', async (req, res) => {

})

// Delete
itemRouter.delete('/', async (req, res) => {

})

// Update
itemRouter.put('/', async (req, res) => {
    
})


// Create
itemRouter.post('/', async (req, res) => {

})


// Edit
itemRouter.get('/:id/edit', async (req, res) => {

})

// Show
itemRouter.get('/:id', async (req, res) => {

})

///////
// Exports
////
module.exports = itemRouter