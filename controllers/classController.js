const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');

exports.addSection=async (req,res,next)=>{
    try{
        console.log(req.body);
        const data=[req.body.section_code,1];
        await pool.execute(
        'INSERT INTO section(section_code,current_semester) VALUES(?,?)',data);
    }catch(err){
        console.log(err);
    }
};
exports.getSectionStudents=async(req,res,next)=>{
    try{
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
        
    }catch(err){
        return res.status(404).json({
            status:'fail',
            err:err
        });
    }
}

exports.getLectureClass=async(req,res,next)=>{
    try{
        console.log(req.params);
        const {username}=req.params;
        const results=(await pool.execute('SELECT section_code,lecture.subject_code,title FROM lecture LEFT JOIN subject ON lecture.subject_code=subject.subject_code'))[0];
        return res.status(200).json({
            status:'success',
            data:results
        }) 
    }catch(err){
        console.log(err);
    }
}
