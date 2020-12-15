const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const {fetcher,fillMarks}=require('./../utils/studentsFetch');
exports.addSection=catchAsync(async (req,res,next)=>{
    const {section_code}=req.body;
    const batch=section_code.substr(0,3);
    const program=section_code.substr(3,3);
    const group1=section_code.substr(6,1);
    const group2=section_code.substr(7,1);
    const data=[req.body.section_code];
    console.log(section_code,data);
    await pool.execute(
    'INSERT INTO section(section_code) VALUES(?)',data);
    await fetcher(batch,program,group1);
    await fetcher(batch,program,group2);
    await fillMarks(section_code);
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
