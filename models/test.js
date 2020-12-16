const pool=require('../db/dbConnection')
const func=async()=>{
    try{
        const result=(await pool.execute(
        'SELECT * FROM person WHERE username=? AND password = ?',["a1","abcdef"]
        ))[0];
        console.log(result);
        }catch(err){
            console.log(err);
}}


func();
// -> { value: {}, error: '"username" is required' }

// Also -

