const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const Apperror=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');
const axios=require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });

const addSubjectsIn=async (program,year,part)=>{
    try{
        const params = new URLSearchParams();
        params.append('prog',program);
        params.append('year', year);
        params.append('part', part);
        const fetchedData=(await axios.post(process.env.subjectURL,params)).data;
        console.log(fetchedData);
        for (data of fetchedData)
        {
            const value=[data[0],program,(year*1-1)*2+part*1];
            pool.execute('INSERT INTO subject_in_program(subject_code,program_code,semester) VALUES(?,?,?)',value).then(
                data=>{}
            ).catch(err=>console.log(err));
        }
    }catch(err){
        console.log(err);
    }
}
