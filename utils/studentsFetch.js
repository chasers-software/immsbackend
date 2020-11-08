const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const Apperror=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');
const axios=require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });
const getSection_code=(a)=>{
    if (a.charCodeAt(0)%2==0) {
      return String.fromCharCode(a.charCodeAt(0)-1,a.charCodeAt(0));
    }
    else
    {
      return String.fromCharCode(a.charCodeAt(0),a.charCodeAt(0)+1);
    }
  }
//console.log(process.env.studentURL);
const addStudent=(data,group)=>{
    const username=data[0]+data[1]+data[2];
    const password="abcdef";
    const full_name=data[3];
    const role=2;
    const active=1;
    const section_code=data[0]+data[1]+getSection_code(group);
    console.log(section_code);
    program_code=data[1];
    current_semester=1;
    const person=[username,password,full_name,role,active];
    const student=[username,section_code,program_code];
    pool.execute('INSERT INTO person(username,password,full_name,role,active) values(?,?,?,?,?)',person).then(
        data=>{
            pool.execute('INSERT INTO student(username,section_code,program_code) values(?,?,?)',student).then(data=>console.log(data)).catch(err=>console.log(err));
        }
    ).catch(err=>console.log(err));
    
}
const fetcher=async (batch,program,group)=>{
    try{
    const params = new URLSearchParams();
    params.append('prog',program);
    params.append('batch', batch);
    params.append('group', group);
    const fetchedData=(await axios.post(process.env.studentURL,params)).data;
    console.log(fetchedData);
    for (data of fetchedData)
    {
       addStudent(data,group);
    }
    }catch(err){
        console.log(err);
    }
};
fetcher('074','BCT','B');