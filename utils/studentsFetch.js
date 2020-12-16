const pool=require('./../db/dbConnection');
//const Apperror=require('./../utils/appError');
const checker=require('../utils/checker');
const catchAsync=require('./../utils/catchAsync');
const axios=require('axios');
const dotenv = require('dotenv');
const {Ziggurat}=require('../utils/Ziggurat')
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
const addStudent=catchAsync(async (data,program_id,section_id,next)=>{
    const username=data[0]+data[1]+data[2];
    const password="abcdef";
    const full_name=data[3];
    const role=2;
    const status=1;
    //const section_code=data[0]+data[1]+getGroup_code(group);
    const params1=[username,password,full_name,role,status];
    
    checker(params1,next);
    
    let person_id=(await pool.execute('INSERT INTO person(username,password,full_name,role,status) '+
                      'values(?,?,?,?,?)',params1))[0].insertId;
    const params2=[person_id,section_id,program_id];
    checker(params2,next)
    await pool.execute('INSERT INTO student(person_id,section_id,program_id) values(?,?,?)',params2);

})
const studentFetcher=catchAsync(async (obj,section_id,group,next)=>{
    //console.log("Group in fetcher:",group,next);
    const {batch_code,program_code,batch_id,program_id}=obj
    const params = new URLSearchParams();
    params.append('prog',program_code);
    params.append('batch', batch_code);
    params.append('group', group);
    console.log(params);
    const fetchedData=(await axios.post(process.env.studentURL,params)).data;
    for (let data of fetchedData)
    {
       await addStudent(data,program_id,section_id,next);
    }   
});
const fillMarks=catchAsync(async (section_id,program_id,next)=>{
    checker([section_id],next);
    const students=(await pool.execute('SELECT person_id from student WHERE section_id=?',[section_id]))[0];
    console.log("Students:",students);
    const subjectInPrograms=(await pool.execute('SELECT subject_id,semester FROM subject_in_program where program_id=?',[program_id]))[0];
    let th=new Ziggurat();
    let pr=new Ziggurat();
    for (let student of students)
    {
        for(let subject of subjectInPrograms)
        {
          let m1=Math.round(th.nextGaussian()*5+14)
          let m2=Math.round(pr.nextGaussian()*5+14)
          const params=[student.person_id,subject.subject_id,m1,m2];
          //MAY NEED TO INSERT CHECKER IF BUGS
          pool.execute('INSERT INTO marks(person_id,subject_id,theory_marks,practical_marks) VALUES(?,?,?,?)',params)
        }
    }
})
const fillMarksTemp=catchAsync(async (section_id,program_id)=>{
 // checker([section_id]);
  const students=(await pool.execute('SELECT person_id from student WHERE section_id=?',[section_id]))[0];
  console.log("Students:",students);
  const subjectInPrograms=(await pool.execute('SELECT subject_id,semester FROM subject_in_program where program_id=?',[program_id]))[0];
  let th=new Ziggurat();
  let pr=new Ziggurat();
  for (let student of students)
  {
      for(let subject of subjectInPrograms)
      {
        let m1=Math.round(th.nextGaussian()*5+14)
        let m2=Math.round(pr.nextGaussian()*5+14)
        const params=[student.person_id,subject.subject_id,m1,m2];
        //MAY NEED TO INSERT CHECKER IF BUGS
        pool.execute('INSERT INTO marks(person_id,subject_id,theory_marks,practical_marks) VALUES(?,?,?,?)',params)
      }
  }
})
//fillMarksTemp(1,1); 
// fetcher("074","BCT","A");
// fetcher("074","BCT","B");
module.exports={studentFetcher,fillMarks};