const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const checker=require('../utils/checker')
exports.assignMarks=catchAsync(async(req,res,next)=>{
    const marks=req.body;
    console.log(req.body);
    const {lecture_id}=req.params;
    checker([lecture_id]);
    const lecture=(await pool.execute('SELECT * FROM lecture WHERE lecture_id=?',[lecture_id]))[0][0];
    const {section_id,subject_id}=lecture;
    console.log("Section Code:",section_id);
    console.log(req.params);
    for (let mark of marks)
    {
        let input=[mark.test,mark.practical,mark.person_id,subject_id];
        checker([mark.person_id]);
        if ((await pool.execute('SELECT person_id FROM student WHERE person_id=?',[mark.person_id]))[0].length==0)
            {return next(new AppError("User person_id Wrong!"))}
        
        await pool.execute('UPDATE marks SET theory_marks=?,practical_marks=? where person_id=? and subject_id=?',input);
        checker([subject_id]);
        let subject_name=(await pool.execute('SELECT title FROM subject WHERE subject_id=?',[subject_id]))[0][0].title;
        console.log(subject_name);
        let msg=`${lecture.lecture_id} updated  ${subject_name} mark`;
        let params2=[lecture.lecture_id,mark.person_id,subject_id,msg]
        checker(params2);
        await pool.execute('INSERT INTO notification(sender_id,receiver_id,subject_id,message) values(?,?,?,?)',params2);
    }
    return res.status(200).json({
        status:'success',
        msg:"Data entered"
    })
})
exports.getMarks=catchAsync(async(req,res,next)=>{
    const {lecture_id}=req.params;
    checker([lecture_id]);
    const lecture=(await pool.execute('SELECT * FROM lecture WHERE lecture_id=?',[lecture_id]))[0][0];
    const params=[lecture.section_id,lecture.subject_id];
    console.log(params);
    const result1=await pool.execute(
        'SELECT person.person_id,username,full_name,theory_marks,practical_marks '+
        'From marks LEFT JOIN person ON marks.person_id=person.person_id '+
        'LEFT JOIN student on marks.person_id=student.person_id '+
        'WHERE student.section_id=? AND marks.subject_id=?',params);
    
    const result2=await pool.execute(
        'SELECT theory_fm,practical_fm FROM subject WHERE subject_id=?',[lecture.subject_id]
    );
    return res.status(200).json({
        status:'success',
        data:result1[0],
        full_fm:result2[0]
    })

})

exports.getSemMarks=catchAsync(async(req,res,next)=>{
    const {person_id,program_id,semester}=req.query;
    //let program_id=username.substr(3,3);
    const params=[person_id,semester*1];
    checker(params);
    const result=(await pool.execute(
        'SELECT subject.subject_code,title,theory_marks,practical_marks FROM marks '+
        'LEFT JOIN subject ON marks.subject_id=subject.subject_id '+
        'LEFT JOIN subject_in_program ON marks.subject_id=subject_in_program.subject_id '+
        'WHERE marks.person_id=? AND semester=? ',params
    ))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
})