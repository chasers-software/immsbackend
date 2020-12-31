const mysql=require('mysql2/promise');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const app=require('./app');
//const pool=require('./db/dbConnection');
// process.on('uncaughtException',err=>{
//     console.log('UNCAUGHT EXCEPTION!');
//     console.log(err.name,err.message);
    
// });






const port=process.env.PORT||3000;
console.log("starting Server!");
const server=app.listen(port,()=>{
    console.log('App running on port ',port);
});
process.on('unhandledRejection',err=>{
    console.log("UNHANDLED REJECTION!");
    console.log(err.name,err.message);
    server.close(()=>{
        process.exit(1);
    });
});