const mysql=require('mysql2/promise');
//const dotenv = require('dotenv');
//dotenv.config({path:'./../config.env'});
//console.log(process.env)
// const pool=mysql.createPool({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'imms',
//     waitForConnections:true
// });
const pool=mysql.createPool({
    host:process.env.dbhost||'localhost',
    user:process.env.dbuser||'root',
    password:process.env.dbpassword||'',
    database:process.env.dbname||'imms',
    waitForConnections:true
});

module.exports=pool;

