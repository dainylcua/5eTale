///////
// Dependencies
////
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema ({
    name: {type: String, required: true},
    itemType: {type: String, required: true},
    content: {type: Object, required: true},
    quantity: {type: Number, default: 1}
})

///////
// Schema to Model and Export
////
module.exports = mongoose.model('Item', itemSchema)