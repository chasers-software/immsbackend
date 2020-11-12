const express= require('express');
const classController=require('../controllers/classController');


const router=express.Router();

router
    .route('/section')
    .post(classController.addSection);
router
    .route('/students/:section_code')
    .get(classController.getSectionStudents);
router
    .route('/lecture/:username')
    .get(classController.getLectureClass);


module.exports=router;