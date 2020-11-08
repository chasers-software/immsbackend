const mysql=require('mysql2/promise');
const pool=mysql.createPool({
    host:'imms.cumcjkrwyakw.us-east-1.rds.amazonaws.com',
    user:'b2ad',
    password:'95TeuWm^D%',
    database:'imms',
    waitForConnections:true
});

pool.on('connection',function(connection){
    console.log('MySql DB connection established');
})
pool.on('acquire',function(connection){
    console.log(`Connection ${connection.threadId} acquired `);
});
pool.on('enqueue',function(){
    console.log('Waiting for available connection slot...');
})
pool.on('release',function(connection){
    console.log('Connection %d released',connection.threadId);
});
module.exports=pool;