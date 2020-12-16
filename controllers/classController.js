const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const {fetcher,fillMarks}=require('./../utils/studentsFetch');
const { checkPreferences } = require('joi');
exports.addSection=catchAsync(async (req,res,next)=>{
    const {batch_id,program_id}=req.body;
    check([batch_id,program_id],next);
    let result1=(await pool.execute('SELECT batch_id,batch_name FROM batch WHERE batch_id=?',[batch_id]))[0];
    let result2=(await pool.execute('SELECT program_id,program_name FROM program WHERE PROGRAM_ID=?',[program_id]))[0];
    if (result1.length==0 || result2.length==0) return next(new AppError("The program or batch doesnt exist"),400);
    const batch_name=result1[0].batch_name;
    const program_name=result2[0].program_name;

    let result3=(await pool.execute('SELECT COUNT(*) AS count FROM section WHERE batch_id=? AND program_id=?',[batch_id,program_id]))[0];
    let group1,group2;
    let count=result3[0].count;
    if (count==0) {group1='A';group2='B';}
    else if (count==1) {group1='C';group2='D';}
    else if (count==2) {group1='E';group2='F';}
    else if (count==3) {group1='G';group2='H';}
    else {group1='I',group2='J'}

    let section_code=batch_name+program_name+group1+group2;
    checker([section_code,batch_id,program_id],next);
    await pool.execute(
    'INSERT INTO section(section_code,batch_id,program_id) VALUES(?,?,?)',[section_code,batch_id,program_id]);
    await fetcher(batch_name,program_name,batch_id,program_id,group1,next);
    await fetcher(batch_name,program_name,batch_id,program_id,group2,next);
    await fillMarks(section_code,next);
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
    console.log("abc");
    console.log(req.params);
    const {username}=req.params;
    const results=(await pool.execute('SELECT section_code,lecture.subject_code,title FROM lecture LEFT JOIN subject ON lecture.subject_code=subject.subject_code WHERE username=?',[username]))[0];
    return res.status(200).json({
        status:'success',
        data:results
    }) 
})

exports.addLecture=catchAsync(async(req,res,next)=>{
    const {username,section_code,subject_code}=req.body;
    console.log(req.body);
    const params=[username,section_code,subject_code,"2022-01-01"];
    const result=await pool.execute('INSERT INTO lecture(username,section_code,subject_code,marks_submission_date) VALUES (?,?,?,?)',params);
    console.log(result);
    return res.status(200).json({
        status:'success'
    }
    );
})
