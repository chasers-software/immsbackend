const pool=require('../db/dbConnection');
const Apperror=require('../utils/appError');
const catchAsync=require('../utils/catchAsync');
const checker = require('../utils/checker');

exports.addBatch=catchAsync(async (req,res,next)=>{
    const {batch_code,semester}=req.body;
    let params1=[batch_code,semester];
    checker(params1);
    const result=(await pool.execute('SQL',params1))[0];
    res.status(400).json({
        status:'success'
    })
});

exports.getAllBatch=catchAsync(async(req,res,next)=>{
    const result=(await pool.execute('SELECT * FROM batch'))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
})
