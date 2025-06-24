const client = require("./client")
const {v4} = require('uuid')
const uuidv4 = v4

const fetchOrders = async (userId) => {
    const SQL = `
        SELECT *
        FROM orders
        WHERE user_id = $1
    `
    let response = await client.query(SQL, [userId])
    const cart = response.rows.find((row) =>row.is_cart)
    if(!cart){
        await client.query(`
            INSERT INTO orders(is_cart, id, user_id) VALUES(true, $1, $2)    
        `, [uuidv4(), userId])
    }
    response = await client.query(SQL, [userId])
    return response.rows

}

const updateOrder = async (order) => {
    const SQL = `
        UPDATE orders
        SET is_cart = $1
        WHERE id = $2
        RETURNING *
    `
    const response = await client.query(SQL, [order.is_cart, order.id])
    return response.rows[0]
}

module.exports = {
    fetchOrders,
    updateOrder
}