///////
// Dependencies
////
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const methOv = require('method-override')
const morgan = require('morgan')
const cors = require('cors')


// Config .env
require('dotenv').config()


///////
// Database Handler
////
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection

db.on('error', (err) => console.log(`Mushroom dance, mushroom dance, whatever could it mean? It means you've got an error: ${err.message}.`))
db.on('connected', () => console.log(`hOI! welcome to... PORT ${db.port}!`))
db.on('disconnected', () => console.log(`User... it was nice to meet you. Goodbye.`))


///////
// Models and Controllers
////
const userController = require('./controllers/users.js')
const sessionController = require('./controllers/sessions.js')
const postController = require('./controllers/posts.js')
const mainController = require('./controllers/main.js')
const apiController = require('./controllers/api.js')


///////
// Mount Middleware
////
const app = express()
app.use(cors())
app.use(methOv('_method'))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(morgan('dev'))


///////
// Routes
////
app.use('/users', userController)
app.use('/sessions', sessionController)
app.use('/posts', postController)
app.use('/', mainController)
app.use('/api', apiController)


///////
// Listener
////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`You wish to know how to return "home", do you not? Ahead of us lies port ${PORT}.`))