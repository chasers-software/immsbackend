const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const checker = require('../utils/checker');
const bcrypt=require('bcryptjs');
const generator = require('generate-password');
exports.addTeacher=catchAsync(async(req,res,next)=>{
    let {username,full_name,email,phone_no,dept_id}=req.body;
    let password=generator.generate({
        length:8,
        numbers:true
    });
    let hashedPassword=await bcrypt.hash(password,12);
    const params1=[username,hashedPassword,full_name,email,phone_no,1,1];
    
    checker(params1);
    
    //console.log(params1,"\n",params2);
    const result=(await pool.execute('SELECT person_id FROM person WHERE username=?',[username]))[0];
    if (result.length!=0)
        {return next(new AppError('Username already exists',409));}
    let person_id=(await pool.execute('INSERT INTO person(username,password,full_name,email,phone_no,role,status) values(?,?,?,?,?,?,?)',params1))[0].insertId;
    const params2=[person_id,dept_id];
    checker(params2);
    await pool.execute('INSERT INTO teacher(person_id,dept_id) values(?,?)',params2);
    res.status(200).json({
        status:'success',
        msg:"User added successfully",
        password
    })
})
exports.getTeachers=catchAsync(async(req,res,next)=>{
    const result=(await pool.execute('SELECT * FROM teacher '+
    'LEFT JOIN person ON person.person_id=teacher.person_id '+
    'LEFT JOIN dept on teacher.dept_id=dept.dept_id WHERE person.status=1'
    ))[0];
    result.forEach(el=>
        {
            el.password=undefined;
        })
    res.status(200).json({
        status:'success',
        data:result
    })
})
exports.getAllStudent=catchAsync(async(req,res,next)=>{
    const {username}=req.query;
    let result;
    if (username)
    {
        result=(await pool.execute('SELECT * FROM person WHERE username=? AND status=1',[username]))[0][0];
        result.password=undefined;
    }
    else
    {
        result=(await pool.execute('SELECT * FROM person '+
        'LEFT JOIN person ON person.person_id=teacher.person_id '+
        'LEFT JOIN dept on teacher.dept_id=dept.dept_id ' 
        ,[]))[0];
        result.forEach(v=>v.password=undefined);
    }    
    if (result.length==0)
        return next(new AppError('The user doesnt exist',400));
    res.status(200).json({
        status:'success',
        data:result
    })
})
exports.getTeacher=catchAsync(async(req,res,next)=>{
    const {person_id}=req.params;
    checker([person_id]);
    const result=(await pool.execute('SELECT * FROM teacher '+
    'LEFT JOIN person ON person.person_id=teacher.person_id '+
    'LEFT JOIN dept on teacher.dept_id=dept.dept_id ' +
    'WHERE teacher.person_id=? AND person.status=1',[person_id]
    ))[0];
    
    if (result.length==0)
        return next(new AppError('The user doesnt exist',400));
    result[0].password=undefined;
    res.status(200).json({
        status:'success',
        data:result[0]
    })
})
exports.updateTeacher=catchAsync(async(req,res,next)=>{
    const {person_id}=req.params;
    const {username,full_name,email,phone_no,dept_id}=req.body;
    const params=[username,full_name,email,phone_no,person_id];
    checker(params);
    await pool.execute('UPDATE person SET username=?,full_name=?,email=?,phone_no=? WHERE person_id=?',params);
    let teacherValues=[dept_id,person_id]
    checker(teacherValues);
    await pool.execute('UPDATE teacher SET dept_id=? WHERE person_id=?',teacherValues);
    res.status(200).json({
        status:'success'
    })
})
exports.deleteTeacher=catchAsync(async(req,res,next)=>{
    const {person_id}=req.params;
    const params=[person_id];
    checker(params);
    await pool.execute('UPDATE person SET status=0 WHERE person_id=?',params);
    res.status(200).json({
        status:'success'
    })
})