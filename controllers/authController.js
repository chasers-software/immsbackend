const crypto=require('crypto');
const {promisify}=require('util');
const jwt=require('jsonwebtoken');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');

const signToken=username=>{
    return jwt.sign({username},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
};

const createSendToken=(user,statusCode,req,res)=>{
    const token=signToken({
        person_id:user.person_id,
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
    const result=(await pool.execute(
        'SELECT * FROM person WHERE username=? AND password = ?',[username,password]
        ))[0];
    if (result.length==0)
        return next(new AppError('User doesnt exist',400));
    createSendToken(result[0],200,req,res);
})

exports.logout=(req,res)=>{
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.status(200).json({status:'success'});
};

exports.protect=catchAsync(async(req,res,next)=>{
    let token=req.cookies.jwt;
    if (!token){
        return next(
            new AppError('You are not logged in! ',401)
        );
    }
    const currentUser={username:"tester"};
    if (!currentUser){
        return next(
            newAppError('The user doesnt exist anymore',401)
        );
    }
    req.user=currentUser;
    res.locals.user=currentUser;
    next();
})