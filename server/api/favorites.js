const express = require('express')
const app = express.Router()
const {
    isLoggedIn
} = require('./middleware')
const {
    fetchFavorites,
    deleteFavorite,
    createFavorite
} = require('../db/favorites')

app.get('/',isLoggedIn, async(req,res,next) => {
    try {
        res.send(await fetchFavorites(req.user.id))
    } catch (error) {
        next(error)
    }
})

app.post('/', async(req,res,next) => {
    try {
        res.send(await createFavorite(req.body))
    } catch (error) {
        next(error)
    }
})

app.delete('/:fav_id/user/:user_id', async(req,res,next) => {
    try {
        
        await deleteFavorite({id: req.params.fav_id, user_id: req.params.user_id})
        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
})

module.exports = app