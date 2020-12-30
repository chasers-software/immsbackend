const express= require('express');
const marksController=require('../controllers/marksController');
const authController=require('../controllers/authController');


const router=express.Router();

router
    .route('/student/')
    .get(marksController.getSemMarks);

router
    .route('/lecture/:lecture_id')
    .post(marksController.assignMarks)
    .get(marksController.getMarks);

router
    .route('/lecture/report/:lecture_id')
    .get(marksController.getMarksReport);

module.exports=router;