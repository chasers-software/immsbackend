const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const checker = require('../utils/checker');
exports.addTeacher=catchAsync(async(req,res,next)=>{
    let {username,password,full_name,email,phone_no,dept_id}=req.body;
    if(!username)
    {
        username=dept_id+full_name.split(' ')[0]
    }

    password="abcdef";
    const params1=[username,password,full_name,email,phone_no,1,1];
    
    checker(params1);
    
    //console.log(params1,"\n",params2);
    const result=(await pool.execute('SELECT person_id FROM person WHERE username=?',[username]))[0];
    if (result.length!=0)
        {return next(new AppError('Username already exists',400));}
    let person_id=(await pool.execute('INSERT INTO person(username,password,full_name,email,phone_no,role,status) values(?,?,?,?,?,?,?)',params1))[0].insertId;
    const params2=[person_id,dept_id];
    checker(params2);
    await pool.execute('INSERT INTO teacher(person_id,dept_id) values(?,?)',params2);
    res.status(200).json({
        status:'success',
        msg:"User added successfully"
    })
})
exports.getTeachers=catchAsync(async(req,res,next)=>{
    const result=(await pool.execute('SELECT * FROM teacher '+
    'LEFT JOIN person ON person.person_id=teacher.person_id '+
    'LEFT JOIN dept on teacher.dept_id=dept.dept_id'
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
exports.getTeacher=catchAsync(async(req,res,next)=>{
    const {person_id}=req.params;
    checker([person_id]);
    const result=(await pool.execute('SELECT * FROM teacher '+
    'LEFT JOIN person ON person.person_id=teacher.person_id '+
    'LEFT JOIN dept on teacher.dept_id=dept.dept_id ' +
    'WHERE teacher.person_id=?',[person_id]
    ))[0];
    result[0].password=undefined;
    if (result.length==0)
        return next(new AppError('The user doesnt exist',400));
    res.status(200).json({
        status:'success',
        data:result[0]
    })
})
exports.updateTeacher=catchAsync(async(req,res,next)=>{
    const {person_id}=req.params;
    const {full_name,email,phone_no,dept_id}=req.body;
    const params=[full_name,email,phone_no,person_id];
    checker(params);
    await pool.execute('UPDATE person SET full_name=?,email=?,phone_no=? WHERE person_id=?',params);
    checker([dept_id,person_id]);
    await pool.execute('UPDATE teacher SET dept_id=? WHERE person_id=?',[dept_id,person_id])
    res.status(200).json({
        status:'success'
    })
})
