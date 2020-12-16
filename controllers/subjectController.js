const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const AppError=require('../utils/appError');
const catchAsync=require('../utils/catchAsync');


exports.addSubject=catchAsync(async (req,res,next)=>{
    
    console.log("In add subject:",req.originalUrl);
    let und;
    let results=(await pool.execute('SELECT subject_id FROM subject where subject_id = ?',[und])
                .catch(err=>next(new AppError(err.message,500))))[0];
    console.log(results[0].subject_id);
    // let results=await pool.execute(
    //     'INSERT INTO subject(subject_code,title,theory_fm,practical_fm) '+
    //     'VALUES(?,?,?,?)',
    //     ['TEST9','test',0,0]
    //     );

    console.log(results[0].insertId);
});
