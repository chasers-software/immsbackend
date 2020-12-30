const pool=require('../db/dbConnection');
const AppError=require('../utils/appError');
const catchAsync=require('../utils/catchAsync');
const checker = require('../utils/checker');
const axios=require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });
let getSemString=(section_no)=>
{
    if (section_no==1) return "AB";
    if (section_no==2) return "CD";
    if (section_no==3) return "EF";
    if (section_no==4) return "GH";
    if (section_no==5) return "IJ";
    if (section_no==6) return "KL";
    if (section_no==7) return "MN";
    if (section_no==8) return "OP";
    return "AB";
}

exports.addBatch=catchAsync(async (req,res,next)=>{
    const {batch_code}=req.body;
    console.log(batch_code);
    let params1=[batch_code,0];
    checker(params1);
    let batch_id=(await pool.execute(
        'INSERT INTO batch(batch_code,semester) values(?,?)',params1
    ))[0].insertId;
    const programs=(await pool.execute('SELECT * FROM program'))[0];
    for (let program of programs)
    {
        const subjectInPrograms=(await pool.execute('SELECT subject_id,semester FROM subject_in_program where program_id=?',[program.program_id]))[0];
        for (let section_no=1;section_no<=program.sections;section_no++)
        {
            let section=getSemString(section_no);
            let section_code=batch_code+program.program_code+section;
            let sectionValues=[section_code,batch_id,program.program_id];
            checker(sectionValues);
            let section_id=(await pool.execute(
                'INSERT INTO section(section_code,batch_id,program_id) values(?,?,?)',sectionValues
            ))[0].insertId;
            let group1=section[0];
            let group2=section[1];
            const params1=new URLSearchParams();
            params1.append('prog',program.program_code);
            params1.append('batch',batch_code);
            params1.append('group',group1);
            const params2=new URLSearchParams();
            params2.append('prog',program.program_code);
            params2.append('batch',batch_code);
            params2.append('group',group2);
            const fetchedStudents1=(await axios.post(process.env.studentURL,params1)).data;
            const fetchedStudents2=(await axios.post(process.env.studentURL,params2)).data;
            const students=[...fetchedStudents1,...fetchedStudents2];
            for (let student of students)
            {
                const username=student[0]+student[1]+student[2];
                const password="abcdef";
                const full_name=student[3];
                const personValues=[username,password,full_name,2,1];
                checker(personValues);
                let person_id=(await pool.execute(
                    'INSERT INTO person(username,password,full_name,role,status) '+
                    'VALUES(?,?,?,?,?)',personValues
                ))[0].insertId;
                const studentValues=[person_id,section_id,program.program_id,batch_id];
                await pool.execute('INSERT INTO student(person_id,section_id,program_id,batch_id) values(?,?,?,?)',studentValues);
                for (let subject of subjectInPrograms)
                {
                    let m1=Math.abs((Math.floor(Math.random()*1000))%20);
                    let m2=Math.abs((Math.floor(Math.random()*1000))%20);
                    let marksValues=[person_id,subject.subject_id,m1,m2];
                    checker(marksValues);
                    pool.execute('INSERT INTO marks(person_id,subject_id,theory_marks,practical_marks) VALUES(?,?,?,?)',marksValues);  
                }

            }


        }
    }
    res.status(200).json({
        status:'success'
    })
});
exports.getAllBatch=catchAsync(async(req,res,next)=>{
    const result=(await pool.execute('SELECT * FROM batch'))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
})
exports.newSession=catchAsync(async(req,res,next)=>{
    await pool.execute('UPDATE batch SET semester=semester+1');
    const finalbatch=(await pool.execute('SELECT * FROM batch WHERE semester=9'))[0];
    if (finalbatch.length!=0){
        for(let batch of finalbatch)
        {
            let updateValues=[batch.batch_id];
            checker(updateValues);
            await pool.execute(
                'UPDATE person '+
                'INNER JOIN student ON person.person_id=student.person_id '+
                'SET status=0 WHERE batch_id=?',
                updateValues
            )
        }
    }
    await pool.execute('UPDATE lecture SET status=0');
    res.status(200).json({
        status:'success',
        msg:"New session started!"
    })
})
exports.getStats=catchAsync(async(req,res,next)=>{
    const teacherCount=(await pool.execute('SELECT COUNT(*) AS total FROM person WHERE role=1 AND status=1'))[0][0].total;
    const studentCount=(await pool.execute('SELECT COUNT(*) AS total FROM person WHERE role=2 AND status=1'))[0][0].total;
    res.status(200).json({
        status:'success',
        data:{
            teachers:teacherCount,
            students:studentCount
        }
    })
})

