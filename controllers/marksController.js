const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');

exports.assignMarks=async(req,res,next)=>{
    try{
        const marks=req.body;
        const {section_code,subject_code}=req.params;
        console.log(req.params);
        for (mark of marks)
        {
            let input=[];
            input=[mark.test,mark.practical,mark.username,subject_code];
            console.log(input);
            await pool.execute('UPDATE marks SET theory_marks=?,practical_marks=? where username=? and subject_code=?',input);
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
        const result1=await pool.execute(
            'SELECT marks.username,full_name,theory_marks,practical_marks '+
            'From marks LEFT JOIN person ON marks.username=person.username '+
            'LEFT JOIN student on marks.username=student.username '+
            'WHERE student.section_code=? AND marks.subject_code=?',params);
        const result2=await pool.execute(
            'SELECT theory_fm,practical_fm FROM subject WHERE subject_code=?',[subject_code]
        );
        return res.status(200).json({
            status:'success',
            data:result1[0],
            full_fm:result2[0]
        })

    }catch(err){
        res.status(400).json({
            status:'fail'
        })
    }
}

exports.getSemMarks=async(req,res,next)=>{
    try{
        const {username,semester}=req.query;
        const params=[username,semester*1];
        const result=(await pool.execute(
            'SELECT marks.subject_code,title,theory_marks,practical_marks FROM marks '+
            'LEFT JOIN subject ON marks.subject_code=subject.subject_code '+
            'WHERE username=? AND semester=?',params
        ))[0];
        res.status(200).json({
            status:'success',
            data:result
        })

    }catch(err){
        console.log(err);
        res.status(404).json({
            status:'fail',
            err:err
        })
    }
}