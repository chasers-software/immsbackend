const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const Joi=require('joi');
const Apperror=require('../utils/appError');
const catchAsync=require('../utils/catchAsync');
const addSubToProg=require('../utils/addSubToProgram');
const checker = require('../utils/checker');

exports.addProgram=catchAsync(async (req,res,next)=>{
    const {program_code,program_name,program_dept,program_degree}=req.body;
    let params1=[program_code,program_name,program_dept,program_degree];
    console.log("params 1 is:",params1);
    checker(params1,next);
    const result=(await pool.execute('INSERT INTO program(program_code,program_name,program_dept,program_degree) VALUES(?,?,?,?)',params1))[0];
    console.log("Inserting Program:",result);
    await addSubToProg(program_code,result.insertId,next);
    res.status(400).json({
        status:'success'
    })
});

exports.getPrograms=catchAsync(async(req,res,next)=>{
    const result=(await pool.execute('SELECT * FROM program'))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
})

exports.getSubjectsInProgram=catchAsync(async(req,res,next)=>{
    const {semester,program_code}=req.query;
    const result=(await pool.execute('SELECT subject.subject_code, title FROM subject_in_program '+
                    'left join subject on subject_in_program.subject_code=subject.subject_code WHERE semester=? and program_code=?',
                    [semester,program_code]))[0];
    res.status(400).json({
        status:'success',
        data:result
    })
})
