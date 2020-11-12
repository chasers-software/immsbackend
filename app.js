const express=require('express');
const morgan=require('morgan');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController');


const subjectRouter=require('./routes/subectRoutes');
const classRouter=require('./routes/classRoutes');
const marksRouter=require('./routes/marksRoutes')
const programRouter=require('./routes/programRoutes')

const app=express();

app.use(helmet());

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
app.use(xss());
app.use(hpp());
app.use(cors());

app.use('/api/subject',subjectRouter);
app.use('/api/class',classRouter);
app.use('/api/marks',marksRouter);
app.use('/api/program',programRouter);

app.use(globalErrorHandler);
module.exports=app;
