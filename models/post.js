///////
// Dependencies
////
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema ({
    name: {type: String, required: true},
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    contentType: {type: String, required: true},
    content: {type: Object, required: true},
})

///////
// Schema to Model and Export
////
module.exports = mongoose.model('Item', postSchema)