const express=require('express');
const morgan=require('morgan');
const path = require('path');
const requestIp=require('request-ip');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const AppError=require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const subjectRouter=require('./routes/subectRoutes');
const classRouter=require('./routes/classRoutes');
const marksRouter=require('./routes/marksRoutes')
const programRouter=require('./routes/programRoutes');
const userRouter=require('./routes/userRoutes');
const batchRouter=require('./routes/batchRoutes');
const notificationRouter=require('./routes/notificationRoutes');
const postRouter=require('./routes/postRoutes');
const deptRouter=require('./routes/deptRoutes');
const app=express();

app.use(express.static(path.join(__dirname, 'build')));


let corsOptions={
    credentials:true
}
app.use(cors(corsOptions))
app.use(helmet());
app.use(requestIp.mw());
if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many requests from this IP, please try later'
});
app.use('/api',limiter);
app.use(express.json({limit:'10kb'}));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next();
});
app.use(xss());
app.use(hpp());


app.use('/api/subject',subjectRouter);
app.use('/api/class',classRouter);
app.use('/api/marks',marksRouter);
app.use('/api/program',programRouter);
app.use('/api/user',userRouter);
app.use('/api/batch',batchRouter);
app.use('/api/notification',notificationRouter);
app.use('/api/post',postRouter);
app.use('/api/dept',deptRouter);

app.all('/api/*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.use(globalErrorHandler);
module.exports=app;
