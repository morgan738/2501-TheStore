const express = require('express')
const app = express.Router()
const {
    fetchProducts,
} = require('../db/products')
const {
    isAdmin,
    isLoggedIn
} = require('./middleware')

app.get('/', async(req,res,next) => {
    try {
        res.send(await fetchProducts())
    } catch (error) {
        next(error)
    }
})

app.put('/:id', isLoggedIn, isAdmin, (req,res,next) => {
    res.send('created product')
})


module.exports = app