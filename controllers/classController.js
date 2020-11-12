const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');
const studentFetcher=require('./../utils/studentsFetch');
exports.addSection=async (req,res,next)=>{
    try{
        const {section_code}=req.body;
        const batch=section_code.substr(0,3);
        const program=section_code.substr(3,3);
        const group1=section_code.substr(6,1);
        const group2=section_code.substr(7,1);
        const data=[req.body.section_code,1];
        await pool.execute(
        'INSERT INTO section(section_code,current_semester) VALUES(?,?)',data);
        await studentFetcher.fetcher(batch,program,group1);
        await studentFetcher.fetcher(batch,program,group2);
        await studentFetcher.fillMarks(section_code);
        res.status(200).json({
            status:'success'
        })
    }catch(err){
        console.log(err);
    }
};
exports.getSection=async(req,res,next)=>{
    try{
        //const result=(await pool.execute('SELECT ')
    }catch(err){
        res.status(400).json({
            status:'fail',
            err:err
        })
    }
}
exports.getSectionStudents=async(req,res,next)=>{
    try{
        console.log(req.params);
        const {section_code}=req.params;
        const result=await pool.execute(
            `SELECT username,full_name FROM student JOIN person USING(username) WHERE section_code=?`,[section_code]
        );
        const data=[];
        for (row of result[0])
        {
            const obj={
                username:row.username,
                full_name:row.full_name};
            data.push(obj);
        }
        console.log(data);
        return res.status(200).json({
            status:'success',
            data:result[0]
        });
        
    }catch(err){
        return res.status(404).json({
            status:'fail',
            err:err
        });
    }
}

exports.getLectureClass=async(req,res,next)=>{
    try{
        console.log("abc");
        console.log(req.params);
        const {username}=req.params;
        const results=(await pool.execute('SELECT section_code,lecture.subject_code,title FROM lecture LEFT JOIN subject ON lecture.subject_code=subject.subject_code'))[0];
        return res.status(200).json({
            status:'success',
            data:results
        }) 
    }catch(err){
        console.log(err);
    }
}

exports.addLecture=async(req,res,next)=>{
    try{
        const {username,section_code,subject_code}=req.query;
        const params=[username,section_code,subject_code,"2022-01-01"];
        await pool.execute('INSERT INTO lecture(username,section_code,subject_code,marks_submission_date)',params1);
    }catch(err){
        res.status(400).json(
            {
                status:'fail',
                err:err
            }
        )
    }
}
exports.addTeacher=async(req,res,next)=>{
    const {username,password,full_name}=req.body;
    const params1=[username,password,full_name,1,1];
    const params2=[username]
    pool.execute('INSERT INTO person(username,password,full_name,role,active) values(?,?,?,?,?)',person).then(
        data=>{
            pool.execute('INSERT INTO teacher(username) values(?)',params2).then(data=>{

            }).catch(err=>console.log(err));
        }
    ).catch(err=>console.log(err));
}
exports.getTeacher=async(req,res,next)=>{
    try{
        const result=(await pool.execute('SELECT * FROM teacher'))[0];
        res.status(200).json({
            status:'success',
            data:result
        })
    }catch(err){
        
    }
}