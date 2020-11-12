const express= require('express');
const classController=require('../controllers/classController');


const router=express.Router();

router
    .route('/section')
    .post(classController.addSection)
    .get(classController.getSection);
router
    .route('/students/:section_code')
    .get(classController.getSectionStudents);
router.route('/lecture')
    .post(classController.addLecture);
router
    .route('/lecture/:username')
    .get(classController.getLectureClass);
router
    .route('/teacher/')
    .post(classController.addTeacher)
    .get(classController.getTeacher);

module.exports=router;