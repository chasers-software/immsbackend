const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const Apperror=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');
const axios=require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });
const getGroup_code=(a)=>{
    if (a.charCodeAt(0)%2==0) {
      return String.fromCharCode(a.charCodeAt(0)-1,a.charCodeAt(0));
    }
    else
    {
      return String.fromCharCode(a.charCodeAt(0),a.charCodeAt(0)+1);
    }
  }
//console.log(process.env.studentURL);
const addStudent=catchAsync(async (data,group,batch_id,program_id,next)=>{
    const username=data[0]+data[1]+data[2];
    const password="abcdef";
    const full_name=data[3];
    const role=2;
    const active=1;
    const section_code=data[0]+data[1]+getGroup_code(group);
    const person=[username,password,role,active];
    const student=[username,full_name,section_code,program_code];
    await pool.execute('INSERT INTO person(username,password,role,active) values(?,?,?,?)',person)
    await pool.execute('INSERT INTO student(username,full_name,section_code,program_code) values(?,?,?,?)',student)    
})
const fetcher=catchAsync(async (batch_name,program_name,batch_id,program_id,group,next)=>{
    const params = new URLSearchParams();
    params.append('prog',program_name);
    params.append('batch', batch_name);
    params.append('group', group);
    const fetchedData=(await axios.post(process.env.studentURL,params)).data;
    for (let data of fetchedData)
    {
       await addStudent(data,group,batch_id,program_id,next);
    }
    
});
const fillMarks=catchAsync(async (section_code)=>{
    const result=await pool.execute('SELECT username from student WHERE section_code=?',[section_code]);
    console.log("Students:",result[0]);
    const program_code=section_code.substr(3,3);
    const subjectInPrograms=(await pool.execute('SELECT subject_code,semester FROM subject_in_program where program_code=?',[program_code]))[0];
    const students=result[0];
    for (student of students)
    {
        for(subject of subjectInPrograms)
        {
          const params=[student.username,subject.subject_code,0,0];
          pool.execute('INSERT INTO marks(username,subject_code,theory_marks,practical_marks) VALUES(?,?,?,?)',params).then(
            data=>{}
        ).catch(err=>console.log(err));
        }
    }
})
// fetcher("074","BCT","A");
// fetcher("074","BCT","B");
module.exports={fetcher,fillMarks};