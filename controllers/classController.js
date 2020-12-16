const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const checker=require('../utils/checker');
const {studentFetcher,fillMarks}=require('./../utils/studentsFetch');
exports.addSection=catchAsync(async (req,res,next)=>{
    const {batch_id,program_id}=req.body;
    checker([batch_id,program_id],next);
    let result1=(await pool.execute('SELECT batch_id,batch_code FROM batch WHERE batch_id=?',[batch_id]))[0];
    let result2=(await pool.execute('SELECT program_id,program_code FROM program WHERE PROGRAM_ID=?',[program_id]))[0];
    if (result1.length==0 || result2.length==0) return next(new AppError("The program or batch doesnt exist"),400);
    const batch_code=result1[0].batch_code;
    const program_code=result2[0].program_code;

    let result3=(await pool.execute('SELECT COUNT(*) AS count FROM section WHERE batch_id=? AND program_id=?',[batch_id,program_id]))[0];
    let group1,group2;
    let count=result3[0].count;
    console.log("Count:",count);
    if (count==0) {group1='A';group2='B';}
    else if (count==1) {group1='C';group2='D';}
    else if (count==2) {group1='E';group2='F';}
    else if (count==3) {group1='G';group2='H';}
    else {group1='I',group2='J'}
    
    let section_code=batch_code+program_code+group1+group2;
    console.log("SEC:",section_code);
    checker([section_code,batch_id,program_id],next);
    let section_id=(await pool.execute(
    'INSERT INTO section(section_code,batch_id,program_id) VALUES(?,?,?)',[section_code,batch_id,program_id]))[0].insertId;
    console.log("Groups:",group1,group2);
    await studentFetcher({batch_code,program_code,batch_id,program_id},section_id,group1,next);
    await studentFetcher({batch_code,program_code,batch_id,program_id},section_id,group2,next);
    await fillMarks(section_id,program_id,next);
    res.status(200).json({
        status:'success'
    })
})
exports.getSection=catchAsync(async(req,res,next)=>{
    const result=(await pool.execute('SELECT * FROM section'))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
})
exports.getAllSection=catchAsync(async(req,res,next)=>{
    const {batch_id,program_id}=req.query;
    const params1=[batch_id*1,program_id*1];
    checker(params1,next);
    const result1=(await pool.execute('SELECT * FROM section WHERE batch_id=? and program_id=?',params1))[0];
    res.status(200).json({
        status:'success',
        data:result1
    })
})
exports.getSectionStudents=catchAsync (async(req,res,next)=>{
    console.log(req.params);
    const {section_code}=req.params;
    const result=await pool.execute(
        `SELECT username,full_name FROM student JOIN person USING(username) WHERE section_code=?`,[section_code]
    );
    const data=[];
    for (row of result[0])
    {
        const obj={
            username:row.username,
            full_name:row.full_name};
        data.push(obj);
    }
    console.log(data);
    return res.status(200).json({
        status:'success',
        data:result[0]
    });
})

exports.getLectureClass=catchAsync(async(req,res,next)=>{

    const {person_id}=req.query;
    const results=(await pool.execute('SELECT * FROM lecture LEFT JOIN subject ON lecture.subject_id=subject.subject_id WHERE person_id=?',[person_id]))[0];
    return res.status(200).json({
        status:'success',
        data:results
    }) 
})

exports.addLecture=catchAsync(async(req,res,next)=>{
    const {person_id,section_id,subject_id}=req.body;
    console.log(req.body);
    const params=[person_id,section_id,subject_id];
    const result=await pool.execute('INSERT INTO lecture(person_id,section_id,subject_id) VALUES (?,?,?)',params);
    console.log(result);
    return res.status(200).json({
        status:'success'
    }
    );
})
