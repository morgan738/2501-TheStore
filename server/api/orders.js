const express = require('express')
const app = express.Router()
const {
    fetchOrders,
    updateOrder
} = require('../db/orders')
const {
    isLoggedIn
} = require('./middleware')

app.get('/', isLoggedIn, async(req,res,next) => {
    try {
        res.send(await fetchOrders(req.user.id))
    } catch (error) {
        next(error)
    }
})

app.put('/:id', isLoggedIn, async(req,res,next) => {
    try {
        res.send(await updateOrder({...req.body, id:req.params.id}))
    } catch (error) {
        next(error)
    }
})


module.exports = app