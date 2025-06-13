const client = require("./client")
const {v4} = require('uuid')
const uuidv4 = v4

const createProduct = async (product) => {
    const SQL = `
        INSERT INTO products(id, name)
        VALUES($1, $2)
        RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), product.name])
    return response.rows[0]
}

const fetchProducts = async() => {
    const SQL = `
        SELECT *
        FROM products
    `
    const response = await client.query(SQL)
    return response.rows
}

module.exports = {
    createProduct,
    fetchProducts
}