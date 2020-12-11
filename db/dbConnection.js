const mysql=require('mysql2/promise');
const pool=mysql.createPool({
    host:'imm.crsmbpoqueg2.us-east-1.rds.amazonaws.com',
    user:'admin',
    password:'ImmsDatabase',
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