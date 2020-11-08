const express= require('express');
const classController=require('../controllers/classController');
const { route } = require('./subectRoutes');

const router=express.Router();

router
    .route('/section')
    .post(classController.addSection);
router
    .route('/section/students/:section_code')
    .get(classController.getSectionStudents);
router
    .route('/section/marks/:section_code/:subject_code')
    .post(classController.assignMarks)
    .get(classController.getMarks);
router
    .route('/teacher/lecture/:username')
    .get(classController.getLectureClass);


module.exports=router;