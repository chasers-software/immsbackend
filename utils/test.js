const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const Apperror=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');
const axios=require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });
const section_code="074BCTAB";
// pool.execute(
//     `SELECT username,full_name FROM student JOIN person USING(username) WHERE section_code=?`,[section_code]
// ).then(data=>{
//     const arr=Array.from(data[0]);
//     console.log(arr);
// }).catch(err=>console.log(err));
mark={
    username:"074BCT002"
};
subject_code="CE401";
pool.execute('SELECT username FROM marks WHERE username=? AND subject_code=?',[mark.username,subject_code]).then(
    data=>{
        if (data[0].length==0){
            
        }
    }
)