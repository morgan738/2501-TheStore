const pg = require('pg')
const client = new pg.Client(
    process.env.DATABASE_URL || 'postgres://localhost/fav_products'
)

module.exports = client