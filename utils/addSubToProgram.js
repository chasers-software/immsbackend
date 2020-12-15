const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const Apperror=require('./../utils/appError');
const catchAsync=require('./catchAsync');
const AppError = require('./appError');
const axios=require('axios');
const dotenv = require('dotenv');
const toArabic=require('roman-numerals').toArabic;

dotenv.config({ path: './../config.env' });

const addSubjectsIn=catchAsync(async (program)=>{
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
                if (data[1].startsWith("Elective"))
                {
                    let nameArray=data[1].split(" ");
                    let num=toArabic(nameArray[1])
                    let newCode=program+year.toString()+part.toString()+num.toString();
                    let newTitle=nameArray[0]+" "+nameArray[1]+" "+program;
                    let params1=[newCode,newTitle,data[2],data[3]];
                    let result1=await pool.execute(
                        'SELECT subject_id FROM subject WHERE subject_code=?',
                        [newCode]
                    ).catch(err=>new AppError(err.msg,400))
                }
                

                const value=[data[0],program,(year*1-1)*2+part*1];
                await pool.execute('INSERT INTO subject_in_program(subject_code,program_code,semester) VALUES(?,?,?)',value);
            }
        }
    }
})
module.exports=addSubjectsIn;
