const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');

exports.addSection=async (req,res,next)=>{
    try{
        console.log(req.body);
        const data=[req.body.section_code,1];
        await pool.execute(
        'INSERT INTO section(section_code,current_semester) VALUES(?,?)',data);
    }catch(err){
        console.log(err);
    }
};
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
exports.assignMarks=async(req,res,next)=>{
    try{
        const marks=req.body;
        const {section_code,subject_code}=req.params;
        for (mark of marks)
        {
            let input=[];
            pool.execute('SELECT username FROM marks WHERE username=? AND subject_code=?',[mark.username,subject_code]).then(
                data=>{
                    console.log("record");
                    input=[mark.test,mark.practical,mark.username,subject_code];
                    console.log(input);
                    pool.execute('UPDATE marks SET theory_marks=?,practical_marks=? where username=? and subject_code=?',input)
                    .then(data=>{
                        console.log("updated");
                    })
                    .catch(err=>console.log(err));
                }
            )

            
        }
        return res.status(200).json({
            status:'success',
            msg:"Data entered"
        })
    }catch(err){
        return res.status(404).json({
            status:'fail',
            err:"error caught"
        })
    }
}
exports.getMarks=async(req,res,next)=>{
    try{
        const {section_code,subject_code}=req.params;
        const params=[section_code,subject_code];
        console.log(params);
        const result=await pool.execute(
            'SELECT marks.username,full_name,theory_marks,practical_marks '+
            'From marks LEFT JOIN person ON marks.username=person.username '+
            'LEFT JOIN student on marks.username=student.username '+
            'WHERE student.section_code=? AND marks.subject_code=?',params);
        return res.status(200).json({
            status:'success',
            data:result[0]
        })

    }catch(err){
        console.log(err);
    }
}

exports.getSemMarks=async(req,res,next)=>{
    try{
        const {username,semester}=req.params;
        const result=(await pool.execute(
            'SELECT marks'
        ))

    }catch(err){
        console.log(err);
    }
}