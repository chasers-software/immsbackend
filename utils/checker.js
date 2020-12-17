module.exports=(arr)=>{
    //console.log("Arr is:",arr);
    let tarr=[...arr];
    tarr.forEach(val=>{
        if(val==undefined) {val=null}
    })
}