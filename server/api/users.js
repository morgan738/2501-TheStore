const express = require('express')
const app = express.Router()
const {
    fetchUsers,
    createUser
} = require('../db/user')


app.get('/', async(req,res,next) => {
    try {
        res.send(await fetchUsers())
    } catch (error) {
        next(error)
    }
})


module.exports = app