const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const pool=require('./db/dbConnection');
pool.execute('INSERT INTO dept(dept_name) values(?)',["Test Depart"]).then(d=>{
    console.log(d[0].insertId);
}
).catch(err=>console.log(err));