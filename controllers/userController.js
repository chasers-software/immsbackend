const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const checker = require('../utils/checker');
exports.addTeacher=catchAsync(async(req,res,next)=>{
    let {username,password,full_name,email,phone_no,program_code}=req.body;
    if(!username)
    {
        username=program_code+full_name.split(' ')[0]
    }
    const params1=[username,password,full_name,email,phone_no,1,1];
    const params2=[1];
    checker(params1,next);
    checker(params2,next);
    console.log(params1,"\n",params2);
    const result=(await pool.execute('SELECT username FROM person WHERE username=?',[username]))[0];
    if (result.length!=0)
        return next(new AppError('Username already exists',400));
    
    await pool.execute('INSERT INTO person(username,password,full_name,email,phone_no,role,status) values(?,?,?,?,?,?,?)',params1)
    await pool.execute('INSERT INTO teacher(program_id) values(?)',params2);
    res.status(200).json({
        status:'success',
        msg:"User added successfully"
    })
})
exports.getTeachers=catchAsync(async(req,res,next)=>{
    const result=(await pool.execute('SELECT teacher.person_id,full_name,email,phone_no,program_code FROM teacher '+
    'LEFT JOIN person ON person.person_id=teacher.person_id;'
    ))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
})
exports.getTeacher=catchAsync(async(req,res,next)=>{
    const {username}=req.params;
    const result=(await pool.execute('SELECT * FROM teacher WHERE username=?',[username]))[0];
    if (result.length==0)
        return next(new AppError('The user doesnt exist',400));
    res.status(200).json({
        status:'success',
        data:result[0]
    })
})
exports.updateTeacher=catchAsync(async(req,res,next)=>{
    const {username}=req.params;
    const {full_name,email,phone_no,program_code}=req.body;
    const params=[full_name,email,phone_no,program_code,username];
    const result=await pool.execute('UPDATE teacher SET full_name=?,email=?,phone_no=?,program_code=? WHERE username=?',params);
    res.status(200).json({
        status:'success'
    })
})