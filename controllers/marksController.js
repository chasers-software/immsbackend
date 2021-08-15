const pool=require('./../db/dbConnection');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const checker=require('../utils/checker');

const xl=require('excel4node');
exports.assignMarks=catchAsync(async(req,res,next)=>{
    const marks=req.body;
    const {lecture_id}=req.params;
    let lectureValues=[lecture_id]
    checker(lectureValues);
    const lecture=(await pool.execute('SELECT * FROM lecture WHERE lecture_id=?',lectureValues))[0][0];
    if(!lecture)
    {
        return next(new AppError("Lecture Doesnt exist!",400));
    }
    
    const {section_id,subject_id}=lecture;
    for (let mark of marks)
    {
        let input=[mark.theory_marks,mark.practical_marks,mark.person_id,subject_id];
        //console.log(mark);
        checker([mark.person_id]);
        let students=(await pool.execute('SELECT person_id,section_id FROM student WHERE person_id=?',[mark.person_id]))[0];
        if (students.length==0)
            {return next(new AppError("User person_id Wrong!"))}
        let student=students[0];
        if (student.section_id!=lecture.section_id) continue;
        await pool.execute('UPDATE marks SET theory_marks=?,practical_marks=? where person_id=? and subject_id=?',input);
        checker([subject_id]);
        let subject_name=(await pool.execute('SELECT title FROM subject WHERE subject_id=?',[subject_id]))[0][0].title;
        //console.log(subject_name);
        
        let msg=`Your ${subject_name} mark has been updated!`;
        let params2=[lecture.lecture_id,mark.person_id,subject_id,msg]
        checker(params2);
        await pool.execute('INSERT INTO notification(sender_id,receiver_id,subject_id,message) values(?,?,?,?)',params2);
    }
    let average=(await pool.execute(
        'SELECT avg(theory_marks)  as average_theory, avg(practical_marks) as average_practical FROM student '+
        'left join marks '+
        'ON student.person_id=marks.person_id '+
        'left join subject '+
        'ON marks.subject_id=subject.subject_id '+
        'WHERE section_id=? AND marks.subject_id=?',[section_id,subject_id]
    ))[0][0];
    let count1=(await pool.execute(
        'SELECT COUNT(*) as count FROM student '+
        'left join marks '+
        'ON student.person_id=marks.person_id '+
        'left join subject '+
        'ON marks.subject_id=subject.subject_id '+
        'WHERE section_id=1 AND marks.subject_id=1 AND theory_marks>=pass_percentage/100*theory_fm'
    ))[0][0].count;
    let count2=(await pool.execute(
        'SELECT COUNT(*) as count FROM student '+
        'left join marks '+
        'ON student.person_id=marks.person_id '+
        'left join subject '+
        'ON marks.subject_id=subject.subject_id '+
        'WHERE section_id=1 AND marks.subject_id=1 AND practical_marks>=pass_percentage/100*practical_fm'
    ))[0][0].count;
    (await pool.execute('UPDATE lecture SET avg_theory=?, avg_practical=?,total_theory_pass=?,total_practical_pass=?,marks_entered=1 WHERE lecture_id=?',[average.average_theory,average.average_practical,count1,count2,lecture_id]))

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
    const {person_id,semester}=req.query;
    let studentValues=[person_id];
    //if(person_id!=req.)
    checker(person_id);
    let students=(await pool.execute('SELECT * FROM student WHERE person_id=?',studentValues))[0];
    if(students.length==0)
    {
        return next(new AppError("The student doesnt exist",400));
    }
    let student=students[0];
    //let program_id=username.substr(3,3);
    const params=[person_id,student.program_id,semester*1];
    checker(params);
    const result=(await pool.execute(
        'SELECT subject.subject_id,subject.subject_code,title,theory_marks,practical_marks FROM marks '+
        'LEFT JOIN subject ON marks.subject_id=subject.subject_id '+
        'LEFT JOIN subject_in_program ON marks.subject_id=subject_in_program.subject_id '+
        'WHERE marks.person_id=? AND subject_in_program.program_id=? AND semester=? ',params
    ))[0];
    res.status(200).json({
        status:'success',
        data:result
    })
})

exports.getMarksReport=catchAsync(async(req,res,next)=>{
    const {lecture_id}=req.params;
    checker([lecture_id]);
    const lecture=(await pool.execute('SELECT * FROM lecture WHERE lecture_id=?',[lecture_id]))[0][0];
    const params=[lecture.section_id,lecture.subject_id];
    const result1=await pool.execute(
        'SELECT person.person_id,username,full_name,theory_marks,practical_marks '+
        'From marks LEFT JOIN person ON marks.person_id=person.person_id '+
        'LEFT JOIN student on marks.person_id=student.person_id '+
        'WHERE student.section_id=? AND marks.subject_id=?',params);
    
    const result2=await pool.execute(
        'SELECT theory_fm,practical_fm FROM subject WHERE subject_id=?',[lecture.subject_id]
    );
    const wb=new xl.Workbook();
  const ws=wb.addWorksheet("1");
  const style=wb.createStyle({
      font:{
          color:'#000000',
          size:12
      }
  });

  let datas=result1[0];
  let row=2;
  let col=1;
  ws.cell(row,col).string("S.N").style(style);
  ws.cell(row,col+1).string("Name").style(style);
  ws.cell(row,col+2).string("Theory Mark").style(style);
  ws.cell(row,col+3).string("Practical Mark").style(style);
  ws.column(col+1).setWidth(30);
  row=row+1;
  let index=1;
  for (let data of datas){
      ws.cell(row,col).number(index).style(style);
      ws.cell(row,col+1).string(data.full_name).style(style);
      ws.cell(row,col+2).number(data.theory_marks).style(style);
      ws.cell(row,col+3).number(data.practical_marks).style(style);
      index=index+1;
      row=row+1;
  }
  return wb.write('file.xlsx',res);
    // return res.status(200).json({
    //     status:'success',
    //     data:result1[0],
    //     full_fm:result2[0]
    // })
})

exports.setSubmissionDate=catchAsync(async(req,res,next)=>{
    const {deadline}=req.body;
    let lectureValues=[deadline];
    await pool.execute('UPDATE lecture SET marks_submission_date=? WHERE status=1',lectureValues); 
    res.status(200).json({
        status:'success',
        msg:"Submission date set!"
    });
})
exports.getSubmissionDate=catchAsync(async(req,res,next)=>{
    //let lectureValues=[deadline];
    let deadlineQuery=(await pool.execute('SELECT marks_submission_date FROM lecture WHERE status=1'))[0];
    if (deadlineQuery.length==0)
    {
        return next(new AppError("Deadline has not been set",400));
    }
    let deadline=deadlineQuery[0].marks_submission_date;

    res.status(200).json({
        status:'success',
        deadline:deadline
    });
})