const express = require('express')
const app = express.Router()
const {
    fetchProducts,
    createProduct,
    updateProduct
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

// localhost:3000/api/products/
app.post('/', isLoggedIn, isAdmin, async (req,res,next) => {
    try {
        
        res.send(await createProduct(req.body))
    } catch (error) {
        next(error)
    }
})

app.put('/:id', isLoggedIn, isAdmin, async(req,res,next) => {
    try {
        res.send(await updateProduct({id: req.params.id, ...req.body}))
    } catch (error) {
        next(error)
    }
})



module.exports = app