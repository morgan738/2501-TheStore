const client = require("./client")
const path = require('path')
const fs = require('fs')
const {
  createUser
} = require('./user')
const {
  createProduct
} = require('./products')
const {
  createFavorite
} = require('./favorites')
const {
    fetchOrders,
    updateOrder
} = require('./orders')
const {
    createLineItem,
    updateLineItem
} = require('./lineitems')

const loadImage = (filePath) => {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(__dirname, filePath)
        //console.log(fullPath)
        fs.readFile(fullPath, 'base64', (err, result) => {
            if(err){
                reject(err)
            }else{
                resolve(`data:image/png;base64,${result}`)
            }
        })
    })
}

const seed = async () => {
    const SQL = `
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS line_items;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            is_admin BOOLEAN DEFAULT false NOT NULL
        );
        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            image TEXT
        );
        CREATE TABLE orders(
            id uuid PRIMARY KEY,
            is_cart BOOLEAN NOT NULL DEFAULT true,
            user_id UUID REFERENCES users(id) NOT NULL
        );
        CREATE TABLE line_items(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES products(id) NOT NULL,
            order_id UUID REFERENCES orders(id) NOT NULL,
            quantity INTEGER DEFAULT 1,
            CONSTRAINT product_and_order_key UNIQUE(product_id, order_id)
        );
        CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            CONSTRAINT product_and_user_id UNIQUE(product_id, user_id)
        );

    `
    await client.query(SQL)

    const aquaphorImage = await loadImage('images/aquaphor.png')
    const proteinImage = await loadImage('images/protein.jpg')

    const [car, protein, aquaphor] = await Promise.all([
        createProduct({name:'car'}),
        createProduct({name:'protein powder', image:proteinImage}),
        createProduct({name: 'aquaphor', image:aquaphorImage})
    ])

    const [ethyl, rowan, morgan] = await Promise.all([
        createUser({username: 'ethyl', password: '1234', is_admin: false}),
        createUser({username: 'rowan', password: 'rowniskewl', is_admin: false}),
        createUser({username: 'morgan', password: 'morganiskewler', is_admin: true}),
    ])

    await Promise.all([
        createFavorite({user_id: ethyl.id, product_id: aquaphor.id}),
        createFavorite({user_id: rowan.id, product_id: aquaphor.id})
    ])

    let orders = await fetchOrders(ethyl.id)
    let cart = orders.find((order) => order.is_cart)
    let lineItem = await createLineItem({order_id:cart.id, product_id:aquaphor.id})
    lineItem.quantity++
    await updateLineItem(lineItem)
    lineItem = await createLineItem({order_id:cart.id, product_id:protein.id})
    //cart.is_cart = false
    await updateOrder(cart)

    console.log('created tables and seeded data')
}

module.exports = {
    seed,
    client
}