const express = require('express')
const app = express.Router()
const {
    fetchProducts,
    createProduct
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

// localhost:3000/api/products/:id
app.put('/:id', isLoggedIn, isAdmin, async (req,res,next) => {
    res.send(await createProduct(req.body))
})


module.exports = app