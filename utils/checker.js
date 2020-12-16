const AppError=require('./../utils/appError');
module.exports=(arr,next)=>{
    //console.log("Arr is:",arr);
    let tarr=[...arr];
    tarr.forEach(val=>{
        if(val==null || val==undefined)
            next(new AppError("Null or Undefined",500))
    })
}