const crypto=require('crypto');
const {promisify}=require('util');
const jwt=require('jsonwebtoken');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const mysql=require('mysql2/promise');
const pool=require('./../db/dbConnection');

const signToken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
};

const createSendToken=(user,statusCode,req,res)=>{
    const token=signToken(user.username);
    const cookieOptions={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    };
    if(process.env.NODE_ENV==='production') cookieOptions.secure=true;
    res.cookie('jwt',token,cookieOptions);
    user.password=undefined;
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    });
};

exports.login=async(req,res,next)=>{
    try{
    const {username,password}=req.body;
    if (!username || !password){
        return next(new AppError('Please provide email and password!',400));
    }
    
    const result=(await pool.execute(
        'SELECT username,role,full_name FROM person WHERE username=? AND password = ?',[username,password]
    ))[0];
    //console.log(result[0].username);
    if (result.length==0)
        return next(new AppError('User doesnt exist',400));
    const user={
        username:result[0].username,
        full_name:result[0].full_name,
        role:result[0].role
    }
    createSendToken(user,200,req,res);
    }catch(err){
        res.status(400).json({
        status:'fail',
        err:err
        })
    }
}

exports.logout=(req,res)=>{
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.status(200).json({status:'success'});
};

exports.protect=async(req,res,next)=>{
    try{
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ){
            token=req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies.jwt){
            token=req.cookies.jwt;
        }
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
    }catch(err){
        res.status(400).json({
            status:'fail',
            err:err
        })
    }
}