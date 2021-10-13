///////
// Dependencies
////
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const methOv = require('method-override')
const morgan = require('morgan')


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



///////
// Mount Middleware
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

const app = express()
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
const userController = require('./controllers/users.js')
const sessionController = require('./controllers/sessions.js')
const postController = require('./controllers/posts.js')


app.use('/users', userController)
app.use('/sessions', sessionController)
app.use('/posts', postController)


app.get('/', (req, res) => {
    res.render('index.ejs', {
    currentUser: req.session.currentUser,
    })
})

app.get('/dashboard', isUser, (req, res) => {
    res.render('dashboard.ejs', {
    currentUser: req.session.currentUser,
    })
})

///////
// Listener
////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`You wish to know how to return "home", do you not? Ahead of us lies port ${PORT}.`))