///////
// File Explanation
////
// Collection model


///////
// Dependencies
////
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collectionSchema = Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    postIds: { type: Array, required: true }
}, { timestamps: true })


///////
// Schema to Model and Export
////
module.exports = mongoose.model('User', collectionSchema)