const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const AppError=require('../utils/appError');
const catchAsync=require('../utils/catchAsync');


exports.addSubject=catchAsync(async (req,res,next)=>{
    
    console.log("In add subject:",req.originalUrl);
    let results=await pool.execute('SELECT * FROM subject WHERE subject_id=?',[]);
    console.log(results);
});
