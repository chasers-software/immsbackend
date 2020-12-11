const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const Apperror=require('../utils/appError');
const catchAsync=require('../utils/catchAsync');
const addSubToProg=require('../utils/addSubToProgram');

exports.addProgram=catchAsync(async (req,res,next)=>{
    try{
        const {program_code,program_name,program_degree}=req.body;
        const params=[program_code,program_name,program_degree];
        await pool.execute('INSERT INTO program(program_code,program_name,program_degree) VALUES(?,?,?)',params)[0];
        // await addSubToProg(program_code,1,1);
        // await addSubToProg(program_code,2,1);
        // await addSubToProg(program_code,3,1);
        // await addSubToProg(program_code,4,1);
        // await addSubToProg(program_code,1,2);
        // await addSubToProg(program_code,2,2);
        // await addSubToProg(program_code,3,2);
        // await addSubToProg(program_code,4,2);
        res.status(400).json({
            status:'success'
        })
    }catch(err){
        
    }
});

exports.getPrograms=async(req,res,next)=>{
    try{
        const result=(await pool.execute('SELECT * FROM program'))[0];
        res.status(200).json({
            status:'success',
            data:result
        })
    }catch(err){
        
    }
}
