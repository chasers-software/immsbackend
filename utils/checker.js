const AppError=require('./../utils/appError');
module.exports=(arr,next)=>{
    //console.log("Arr is:",arr);
    let tarr=[...arr];
    tarr.forEach(val=>{
        if(val==undefined) {val=null}
    })
}