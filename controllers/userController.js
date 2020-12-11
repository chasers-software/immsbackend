const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const AppError=require('./../utils/appError');
exports.addTeacher=async(req,res,next)=>{
    try{
        const {username,password,full_name}=req.body;
        const params1=[username,password,full_name,1,1];
        const params2=[username]
        const result=(await pool.execute('SELECT username FROM person WHERE username=?',[username]))[0];
        if (result.length!=0)
            return next(new AppError('Username already exists',400));
        
        await pool.execute('INSERT INTO person(username,password,full_name,role,active) values(?,?,?,?,?)',params1)
        await pool.execute('INSERT INTO teacher(username) values(?)',params2);
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
        const result=(await pool.execute('SELECT username,full_name FROM person WHERE role=1'))[0];
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