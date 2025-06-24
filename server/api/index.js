const express = require("express")
const app = express.Router()

//define api routes here
app.use('/users', require('./users'))
app.use('/products', require('./products'))
app.use('/favorites', require('./favorites'))
app.use('/auth', require('./auth'))
app.use('/orders', require('./orders'))
app.use('/lineitems', require('./lineitems'))

module.exports = app