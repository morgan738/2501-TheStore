const client = require("./client")
const {
  createUser
} = require('./user')
const {
  createProduct
} = require('./products')
const {
  createFavorite
} = require('./favorites')

const seed = async () => {
    const SQL = `
        DROP TABLE IF EXISTS favorites;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            is_admin BOOLEAN DEFAULT false NOT NULL
        );
        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        );
        CREATE TABLE favorites(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            CONSTRAINT product_and_user_id UNIQUE(product_id, user_id)
        );

    `
    await client.query(SQL)
    const [car, protein, aquaphor] = await Promise.all([
        createProduct({name:'car'}),
        createProduct({name:'protein powder'}),
        createProduct({name: 'aquaphor'})
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

    console.log('created tables and seeded data')
}

module.exports = {
    seed,
    client
}