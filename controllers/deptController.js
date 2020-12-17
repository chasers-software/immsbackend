const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const AppError=require('../utils/appError');
const checker=require('../utils/checker');
const catchAsync=require('../utils/catchAsync');


exports.getAllDept=catchAsync(async (req,res,next)=>{
    
    let result=(await pool.execute('SELECT * FROM dept'))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
});
exports.addDept=catchAsync(async (req,res,next)=>{
    let {dept_name}=req.body;
    console.log("DEPT:",dept_name);
    checker([dept_name]);
    await pool.execute('INSERT INTO dept(dept_name) values(?)',[dept_name]);
    res.status(200).json({
        status:'success',
        msg:"Department Added!"
    })
});