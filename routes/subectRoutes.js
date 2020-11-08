const express= require('express');
const subjectController=require('../controllers/subjectController');

const router=express.Router();

router
    .route('/')
    .post(subjectController.addSubject);
module.exports=router;