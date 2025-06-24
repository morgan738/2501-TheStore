const client = require("./client")
const {v4} = require('uuid')
const uuidv4 = v4

const ensureCart = async (lineItem) => {
    let orderId = lineItem.order_id
    if(!orderId){
        const SQL = `
            SELECT order_id
            FROM line_items
            WHERE id = $1
        `
        const response = await client.query(SQL, [lineItem.id])
        orderId = response.rows[0].order_id
    }
    const SQL = `
        SELECT *
        FROM orders
        WHERE id = $1 AND is_cart = true
    `
    const response = await client.query(SQL, [orderId])
    if(!response.rows.length){
        throw Error("An order which has been placed can not be changed")
    }
}

const fetchLineItems = async(userId) => {
    const SQL = `
        SELECT line_items.*
        FROM line_items
        JOIN orders
        ON orders.id = line_items.order_id
        JOIN users
        ON users.id = orders.user_id
        WHERE users.id = $1
    `
    const response = await client.query(SQL, [userId])
    return response.rows
}

const createLineItem = async (lineItem) => {
    const SQL = `
        INSERT INTO line_items(product_id, order_id, id)
        VALUES($1, $2, $3)
        RETURNING *
    `
    const response = await client.query(SQL, [lineItem.product_id, lineItem.order_id, uuidv4()])
    return response.rows[0]
}

const updateLineItem = async (lineItem) => {
    await ensureCart(lineItem)
    const SQL = `
        UPDATE line_items
        SET quantity = $1
        WHERE id = $2
        RETURNING *
    `
    if(lineItem.quantity <= 0){
        throw Error ('a line item quantity must be greater than 0')
    }
    const response = await client.query(SQL, [lineItem.quantity, lineItem.id])
    return response.rows[0]
}

module.exports = {
    updateLineItem,
    createLineItem,
    fetchLineItems
}