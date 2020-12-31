const mysql=require('mysql2/promise');
const dotenv=require('dotenv');
dotenv.config({path:'./'});
console.log()
const pool=require('./../db/dbConnection');
const Apperror=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');
const axios=require('axios');
//const dotenv = require('dotenv');
const toArabic=require('roman-numerals').toArabic;
//dotenv.config({ path: './../config.env' });
// pool.execute('INSERT INTO dept(dept_name) values(?)',["Test Depart"]).then(d=>{
//     console.log(d);
// }
// ).catch(err=>console.log(err));

// pool.execute(
                //     'INSERT INTO person(username,password,full_name,role,status) '+
                //     'VALUES(?,?,?,?,?)',personValues
                // ).then(data=>{
                //     const studentValues=[data[0].insertId,section_id,program.program_id,batch_id];
                //     pool.execute('INSERT INTO student(person_id,section_id,program_id,batch_id) values(?,?,?,?)',studentValues);
                //     for (let subject of subjectInPrograms)
                //     {
                //         let m1=Math.abs((Math.floor(Math.random()*1000))%20);
                //         let m2=Math.abs((Math.floor(Math.random()*1000))%20);
                //         let marksValues=[data[0].insertId,subject.subject_id,m1,m2];
                //         checker(marksValues);
                //         pool.execute('INSERT INTO marks(person_id,subject_id,theory_marks,practical_marks) VALUES(?,?,?,?)',marksValues);  
                //     }
                // })
                