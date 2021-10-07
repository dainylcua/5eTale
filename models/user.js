///////
// Dependencies
////
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
}, { timestamps: true })

///////
// Schema to Model and Export
////
module.exports = mongoose.model('User', userSchema)