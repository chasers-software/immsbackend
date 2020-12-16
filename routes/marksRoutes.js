const express= require('express');
const marksController=require('../controllers/marksController');


const router=express.Router();

router
    .route('/student/')
    .get(marksController.getSemMarks);

router
    .route('/lecture/:lecture_id')
    .post(marksController.assignMarks)
    .get(marksController.getMarks);



module.exports=router;