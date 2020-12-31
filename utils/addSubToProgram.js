const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const Apperror=require('./../utils/appError');
const catchAsync=require('./catchAsync');
const AppError = require('./appError');
const axios=require('axios');
//const dotenv = require('dotenv');
const toArabic=require('roman-numerals').toArabic;
const checker = require('./checker');

//dotenv.config({ path: './../config.env' });

const addSubjectsIn=catchAsync(async (program,program_id,next)=>{
    const params = new URLSearchParams();
    const years=[1,2,3,4];
    const parts=[1,2];
    for (let year of years)
    {
        for (let part of parts)
        {
            params.append('prog',program);
            params.append('year', year);
            params.append('part', part);
            const fetchedData=(await axios.post(process.env.subjectURL,params)).data;
            for (let data of fetchedData)
            {
                let params1=[...data];
                let subject_id;
                //for Subject
                if (data[1].startsWith("Elective"))
                {
                    let nameArray=data[1].split(" ");
                    let num=toArabic(nameArray[1])
                    let newCode=program+year.toString()+part.toString()+num.toString();
                    let newTitle=nameArray[0]+" "+nameArray[1]+" "+program;
                    params1=[newCode,newTitle,data[2],data[3]];
                }
                let paramsA=[params1[0]];
                checker(paramsA,next);
                let result1=(await pool.execute(
                    'SELECT subject_id FROM subject WHERE subject_code=?',
                    paramsA
                ))[0];
                if (result1.length==0)
                {
                    checker(params1,next);
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
                let paramsB=[program_id,subject_id];
                checker(paramsB,next);
                let result2=(await pool.execute(
                    'SELECT id from subject_in_program '+
                    'WHERE program_id=? AND subject_id=?',
                    paramsB
                ))[0];
                if (result2.length==0)
                {
                    let paramsC= [program_id,subject_id,(year*1-1)*2+part*1];
                    checker(paramsC,next);
                    await pool.execute(
                    'INSERT INTO subject_in_program(program_id,subject_id,semester) '+
                    'VALUES(?,?,?)',
                    paramsC
                    )
                }
            }
        }
    }
});
const addSubjects=catchAsync(async ()=>{
    const programs=(await pool.execute('Select * FROM program'))[0];
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
                    let paramsB=[program_id,subject_id];
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
})
module.exports=addSubjectsIn;
module.exports=addSubjects;