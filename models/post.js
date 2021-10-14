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
    description: {type: String, default: ''},
    contentType: {type: String, required: true},
    content: {type: Object, required: true},
    favorites: {type: Number, default: 0}
}, {timestamps: true})

///////
// Schema to Model and Export
////
module.exports = mongoose.model('Post', postSchema)