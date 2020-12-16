const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const AppError=require('../utils/appError');
const checker=require('../utils/checker');
const catchAsync=require('../utils/catchAsync');


exports.getAllNotification=catchAsync(async (req,res,next)=>{
    let {person_id}=req.query;
    let result=(await pool.execute('SELECT * FROM notification WHERE receiver_id=? ORDER BY created_at DESC',[person_id]))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
});
exports.addNotification=catchAsync(async (req,res,next)=>{
    let {notification_name}=req.body;
    checker([notification_name],next);
    await pool.execute('INSERT INTO notification(notification_name) values(?)',[notification_name]);
    res.status(200).json({
        status:'success',
        data:result
    })
});