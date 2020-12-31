const express= require('express');
const marksController=require('../controllers/marksController');
const authController=require('../controllers/authController');


const router=express.Router();
router.use(authController.protect);

router
    .route('/student/')
    .get(marksController.getSemMarks);

router
    .route('/lecture/:lecture_id')
    .post(authController.restrictTo(0,1),marksController.assignMarks)
    .get(authController.restrictTo(0,1),marksController.getMarks);

router
    .route('/lecture/report/:lecture_id')
    .get(marksController.getMarksReport);

router
    .route('/deadline')
    .get(marksController.getSubmissionDate)
    .post(marksController.setSubmissionDate);
module.exports=router;