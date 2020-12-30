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
    //let {}=req.body;
    //checker([notification_name]);
    await pool.execute('INSERT INTO notification(sender_id,receiver_id,subject_id,message,type) values(?,?,?,?)',[notification_name]);
    res.status(200).json({
        status:'success',
        data:result
    })
});
exports.report=catchAsync(async (req,res,next)=>{
    let {person_id,subject_id}=req.body;
    let student_name=(await pool.execute('SELECT full_name FROM person WHERE person_id=?',[person_id]))[0][0].full_name;
    let subject_title=(await pool.execute('SELECT title FROM subject WHERE subject_id=?',[subject_id]))[0][0].title;
    //checker([notification_name]);
    let teachers=(await pool.execute(
        'SELECT lecture.person_id FROM lecture LEFT JOIN student ON lecture.section_id=student.section_id '+
        'WHERE student.person_id=? and lecture.subject_id=?',[person_id,subject_id]))[0];
    for (let teacher of teachers)
    {
        let message=`${student_name} requested to recheck marks of ${subject_title}`;
        let params=[person_id,teacher.person_id,subject_id,message];
        await pool.execute('INSERT INTO notification(sender_id,receiver_id,subject_id,message) values(?,?,?,?)',params);
    }
    res.status(200).json({
        status:'success',
        data:"Reported"
    })
});
