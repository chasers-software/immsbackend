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
    port:process.env.dbport||3306,
    password:process.env.dbpassword||'',
    database:process.env.dbname||'imms',
    waitForConnections: process.env.waitForConnections||false,
});

if(!process.env.waitForConnections){
  pool.getConnection(function(err) {
      if(err) {
        console.log('error '+err.message);
      }
      console.log('Connected to the MySQL server.');
    });
}

module.exports=pool;

