const express = require('express')
const app = express.Router()
const {
    fetchLineItems,
    createLineItem,
    updateLineItem
} = require('../db/lineitems')
const {
    isLoggedIn
} = require('./middleware')

app.get('/', isLoggedIn, async(req, res, next) => {
    try {
        res.send(await fetchLineItems(req.user.id))
    } catch (error) {
        next(error)
    }
})

app.post('/', isLoggedIn, async(req,res,next) => {
    try {
        res.send(await createLineItem(req.body))
    } catch (error) {
        next(error)
    }
})

app.put('/:id', isLoggedIn, async(req,res,next) => {
    try {
        res.send(await updateLineItem({...req.body, id: req.params.id}))
    } catch (error) {
        next(error)
    }
})

module.exports = app