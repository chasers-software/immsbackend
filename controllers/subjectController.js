const mysql=require('mysql2/promise');
const pool=require('../db/dbConnection');
const AppError=require('../utils/appError');
const checker=require('../utils/checker');
const catchAsync=require('../utils/catchAsync');
const toArabic=require('roman-numerals').toArabic;
const axios=require('axios');
//const dotenv = require('dotenv');
//dotenv.config({ path: './../config.env' });

// exports.addSubject=catchAsync(async (req,res,next)=>{
    
//     console.log("In add subject:",req.originalUrl);
//     let und;
//     await testAsync();
//     // let results=(await pool.execute('INSERT INTO subject(subject_code,title,theory_fm,practical_fm) VALUES(?,?,?,?)',params));
//     // console.log(results);

//     // let results=await pool.execute(
//     //     'INSERT INTO subject(subject_code,title,theory_fm,practical_fm) '+
//     //     'VALUES(?,?,?,?)',
//     //     ['TEST9','test',0,0]
//     //     );

//     //console.log(results[0].insertId);
// });
exports.addSubjects=catchAsync(async (req,res,next)=>{
    const programs=(await pool.execute('Select * FROM program'))[0];
    console.log("Adding Subjects in Programs:",programs);
    for (let program of programs)
    {
        const params = new URLSearchParams();
        const years=[1,2,3,4];
        const parts=[1,2];
        for (let year of years)
        {
            for (let part of parts)
            {
                params.append('prog',program.program_code);
                params.append('year', year);
                params.append('part', part);
                const fetchedData=(await axios.post(process.env.subjectURL,params)).data;
                console.log("Fetched Data:",fetchedData);
                for (let data of fetchedData)
                {
                    let params1=[...data];
                    let subject_id;
                    //for Subject
                    if (data[1].startsWith("Elective"))
                    {
                        let nameArray=data[1].split(" ");
                        let num=toArabic(nameArray[1])
                        let newCode=program.program_code+year.toString()+part.toString()+num.toString();
                        let newTitle=nameArray[0]+" "+nameArray[1]+" "+program.program_code;
                        params1=[newCode,newTitle,data[2],data[3]];
                    }
                    let paramsA=[params1[0]];
                    checker(paramsA);
                    let result1=(await pool.execute(
                        'SELECT subject_id FROM subject WHERE subject_code=?',
                        paramsA
                    ))[0];
                    if (result1.length==0)
                    {
                        checker(params1);
                        subject_id=(await pool.execute(
                            'INSERT INTO subject(subject_code,title,theory_fm,practical_fm) '+
                            'VALUES(?,?,?,?)',
                            params1
                            ))[0].insertId;
                    }
                    else {
                        subject_id=result1[0].subject_id;
                    }
                    
                    //For Adding Subjects To Program
                    let paramsB=[program.program_id,subject_id];
                    checker(paramsB);
                    let result2=(await pool.execute(
                        'SELECT id from subject_in_program '+
                        'WHERE program_id=? AND subject_id=?',
                        paramsB
                    ))[0];
                    if (result2.length==0)
                    {
                        let paramsC= [program.program_id,subject_id,(year*1-1)*2+part*1];
                        checker(paramsC);
                        await pool.execute(
                        'INSERT INTO subject_in_program(program_id,subject_id,semester) '+
                        'VALUES(?,?,?)',
                        paramsC
                        )
                    }
                }
            }
        }
    }
    res.status(200).json({
        status:'success',
        msg:"Subjects Added"
    })
})
