const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const checker=require('../utils/checker')
exports.assignMarks=catchAsync(async(req,res,next)=>{
    const marks=req.body;
    console.log(req.body);
    const {section_id,subject_id}=req.params;
    console.log("Section Code:",section_id);
    console.log(req.params);
    for (let mark of marks)
    {
        let input=[];
        input=[mark.theory_marks,mark.practical_marks,mark.person_id,subject_id];
        console.log(input);
        await pool.execute('UPDATE marks SET theory_marks=?,practical_marks=? where username=? and subject_code=?',input);
    }
    return res.status(200).json({
        status:'success',
        msg:"Data entered"
    })
})
exports.getMarks=catchAsync(async(req,res,next)=>{
    const {section_id,subject_id}=req.params;
    const params=[section_id,subject_id];
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

})

exports.getSemMarks=catchAsync(async(req,res,next)=>{
    const {username,semester}=req.query;
    let program_code=username.substr(3,3);
    const params=[username,semester*1,program_code];
    const result=(await pool.execute(
        'SELECT marks.subject_code,title,theory_marks,practical_marks FROM marks '+
        'LEFT JOIN subject ON marks.subject_code=subject.subject_code '+
        'LEFT JOIN subject_in_program ON marks.subject_code=subject_in_program.subject_code '+
        'WHERE username=? AND semester=? AND program_code=?',params
    ))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
})