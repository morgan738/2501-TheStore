const express = require('express')
const app = express.Router()
const {
    fetchProducts,
} = require('../db/products')
const {
    isAdmin,
    isLoggedIn
} = require('./middleware')

// localhost:3000/api/products/
app.get('/', async(req,res,next) => {
    try {
        res.send(await fetchProducts())
    } catch (error) {
        next(error)
    }
})

// locaolhost:3000/api/products/:id
app.put('/:id', isLoggedIn, isAdmin, (req,res,next) => {
    res.send('created product')
})


module.exports = app