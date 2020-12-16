const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const AppError=require('../utils/appError');
const checker=require('../utils/checker');
const catchAsync=require('../utils/catchAsync');

const testAsync=catchAsync(async()=>{
    return Promise.reject(new Error("Error"));
})
exports.addSubject=catchAsync(async (req,res,next)=>{
    
    console.log("In add subject:",req.originalUrl);
    let und;
    await testAsync();
    // let results=(await pool.execute('INSERT INTO subject(subject_code,title,theory_fm,practical_fm) VALUES(?,?,?,?)',params));
    // console.log(results);

    // let results=await pool.execute(
    //     'INSERT INTO subject(subject_code,title,theory_fm,practical_fm) '+
    //     'VALUES(?,?,?,?)',
    //     ['TEST9','test',0,0]
    //     );

    //console.log(results[0].insertId);
});
