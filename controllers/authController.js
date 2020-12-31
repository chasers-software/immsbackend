const crypto=require('crypto');
const {promisify}=require('util');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const pool=require('./../db/dbConnection');
const checker = require('../utils/checker');

const signToken=value=>{
    return jwt.sign(value,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
};

const createSendToken=(user,statusCode,req,res)=>{
    const token=signToken({
        person_id:user.person_id,
        ip:user.ip
        });
    const cookieOptions={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    };
    if(process.env.NODE_ENV==='production') cookieOptions.secure=true;
    res.cookie('jwt',token,cookieOptions);
    user.password=undefined;
    res.status(statusCode).json({
        status:'success',
        data:{
            user
        }
    });
};

exports.login=catchAsync(async(req,res,next)=>{
    console.log("Logging in from : ",req.clientIp,"\n");
    const {username,password}=req.body;
    if (!username || !password){
        return next(new AppError('Please provide email and password!',400));
    }
    
    const userResult=(await pool.execute(
        'SELECT * FROM person WHERE username=?',[username]
        ))[0];
    if (userResult.length==0)
        return next(new AppError('Username Or Password wrong!',400));
    let user=userResult[0];
    let correctPassword=await bcrypt.compare(password,user.password);
    if(!correctPassword)
        return next(new AppError('Username Or Password wrong',400));
    if (user.status==0){
        return next(new AppError("Your account has been deactivated",400));
    }
    user.password=undefined;
    user.ip=req.clientIp;
    createSendToken(user,200,req,res);
})

exports.logout=(req,res)=>{
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.status(200).json({status:'success'});
};

exports.protect=catchAsync(async(req,res,next)=>{
    // let token=req.cookies.jwt;
    // if (!token){
    //     return next(
    //         new AppError('You are not logged in! ',401)
    //     );
    // }
    // const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    // console.log("Decoded IP:",decoded.ip);
    // if (req.clientIp!=decoded.ip){
    //     return next(
    //         new AppError("The token is not valid for this IP",401)
    //     );
    // }
    // let personValues=[decoded.person_id];
    // checker(personValues);
    // const currentUser=(await pool.execute('SELECT * FROM person WHERE person_id=?',personValues))[0];
    // if (!currentUser){
    //     return next(
    //         new AppError('The user doesnt exist anymore',401)
    //     );
    // }
    // console.log("Request FROM:",currentUser[0]);
    // currentUser[0].password=undefined;
    // req.user=currentUser[0];
    // res.locals.user=currentUser[0];
    next();
});
exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        // if(!roles.includes(req.user.role)){
        //     return next(
        //         new AppError("You do not have permission!",403)
        //     );
        // }
        next();
    }
}