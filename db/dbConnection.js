const mysql=require('mysql2/promise');
//const dotenv = require('dotenv');
//dotenv.config({path:'./../config.env'});

const pool=mysql.createPool({
    host:process.env.dbhost||'localhost',
    user:process.env.dbuser||'root',
    port:process.env.dbport||3306,
    password:process.env.dbpassword||'',
    database:process.env.dbname||'imms',
    waitForConnections: true
});

module.exports=pool;

