const crypto=require('crypto');
const {promisify}=require('util');
const jwt=require('jsonwebtoken');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');

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

exports.login=catchAsync(async(req,res,next)=>{
    const {username,password}=req.body;

    if (!email || !password){
        return next(new AppError('Please provide email and password!',400));
    }
    const user={
        username:"tester"
    };

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
})