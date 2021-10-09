///////
// Dependencies
////
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const methOv = require('method-override')


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

///////
// Routes
////
const userController = require('./controllers/users.js')
const sessionController = require('./controllers/sessions.js')


app.use('/users', userController)
app.use('/sessions', sessionController)



app.get('/', (req, res) => {
    if (req.session.currentUser) {
        res.render('dashboard.ejs', {
            currentUser: req.session.currentUser,
        })
    } else {
        res.render('index.ejs', {
            currentUser: req.session.currentUser,
        })
    }
})


///////
// Listener
////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`You wish to know how to return "home", do you not? Ahead of us lies port ${PORT}.`))