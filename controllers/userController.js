const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const AppError=require('./../utils/appError');
exports.addTeacher=async(req,res,next)=>{
    try{
        const {username,password,full_name,email,phone_no,program_code}=req.body;
        const params1=[username,password,full_name,1,1];
        const params2=[username,email,phone_no,program_code];
        const result=(await pool.execute('SELECT username FROM person WHERE username=?',[username]))[0];
        if (result.length!=0)
            return next(new AppError('Username already exists',400));
        
        await pool.execute('INSERT INTO person(username,password,full_name,role,active) values(?,?,?,?,?)',params1)
        await pool.execute('INSERT INTO teacher(username,email,phone_no,program_code) values(?,?,?,?)',params2);
        res.status(200).json({
            status:'success',
            msg:"User added successfully"
        })
    }catch(err){
        return res.status(404).json({
            status:'fail',
            err:err
        })
    }
}
exports.getTeacher=async(req,res,next)=>{
    try{
        const result=(await pool.execute('SELECT teacher.username,full_name,email,phone_no,program_code FROM teacher '+
        'LEFT JOIN person ON person.username=teacher.username;'
        ))[0];
        res.status(200).json({
            status:'success',
            data:result
        })
    }catch(err){
        return res.status(404).json({
            status:'fail',
            err:err
        })
    }
}