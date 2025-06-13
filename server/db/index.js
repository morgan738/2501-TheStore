const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/your_db_name_here');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const seed = async()=> {
  console.log("add logic to create and seed tables")
};



module.exports = {
  client,
  seed
};
