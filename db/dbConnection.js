const mysql=require('mysql2/promise');
const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'imms',
    waitForConnections:true
});

pool.on('connection',function(connection){
    
})
pool.on('acquire',function(connection){
    
});
pool.on('enqueue',function(){
    
})
pool.on('release',function(connection){
});
module.exports=pool;

