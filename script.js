const pool=require('./db/dbConnection');
const fs=require('fs');
const { STATUS_CODES } = require('http');
const stringData=fs.readFileSync("./datas/subjects.json", 
{encoding:'utf8', flag:'r'});
const rawData=JSON.parse(stringData);
//console.log(rawData);
const newData=[];
for (const row of rawData)
{
    const {code, name,m1,m2}=row;
    const newRow=[code,name,m1,m2,40];
    const newObj={
        subject_code:code,
        title:name,
        theory_fm:m1,
        practical_fm:m2,
        pass_percentage:40
    }
    newData.push(newRow);
}

// pool.execute('INSERT INTO subject SET subject_code=?,title=?,theory_fm=?,practical_fm=?,pass_percentage=?',newData).then(data=>{
//     console.log("inserted");
// }).catch(err=>console.log(err));
for (data of newData){
    
    pool.execute('INSERT INTO subject(subject_code,title,theory_fm,practical_fm,pass_percentage) values(?,?,?,?,?)',data).then(data=>{
    console.log("inserted");
}).catch(err=>console.log(err));
}


