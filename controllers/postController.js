const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const AppError=require('../utils/appError');
const checker=require('../utils/checker');
const catchAsync=require('../utils/catchAsync');


exports.getAllPost=catchAsync(async (req,res,next)=>{
    let {person_id}=req.query;
    let result1=(await pool.execute('SELECT person_id,role FROM person WHERE person_id=?',[person_id]))[0][0];
    if (!result1)
    {
        return next(new AppError("User not found",400));
    }
    let posts;
    if (result1.role==1)
    {
        posts=(await pool.execute(
            'SELECT username,content,full_name,email FROM post LEFT JOIN person ON post.person_id=person.person_id '+
            'WHERE post.person_id=? ORDER BY post.created_at DESC',[person_id]
            ))[0];
    }
    else if (result1.role==2)
    {
        posts=(await pool.execute(
            'SELECT username,content,full_name,email FROM post LEFT JOIN student ON post.section_id=student.section_id '+
            'LEFT JOIN person ON post.person_id=person.person_id '+
            'WHERE student.person_id=? ORDER BY post.created_at DESC',[person_id]
        ))[0];
        posts
    }
    // let result=(await pool.execute('SELECT * FROM post WHERE receiver_id=? ORDER BY created_at DESC',[person_id]))[0];
    res.status(200).json({
        status:'success',
        data:posts
    })
});
exports.addPost=catchAsync(async (req,res,next)=>{
    //let {}=req.body;
    //checker([post_name]);
    const {person_id,section_id,content}=req.body;
    let params=[person_id,section_id,content];
    await pool.execute('INSERT INTO post(person_id,section_id,content) values(?,?,?)',params);
    res.status(200).json({
        status:'success',
        data:"Post added successully!"
    })
});