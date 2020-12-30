const express= require('express');
const classController=require('../controllers/classController');
const authController=require('../controllers/authController');


const router=express.Router();

router
    .route('/section')
    .post(classController.addSection)
    .get(classController.getAllSection);
router
    .route('/students/:section_code')
    .get(classController.getSectionStudents);

router.route('/lecture/:lecture_id')
.delete(classController.deleteLecture);

router.route('/lecture')
    .post(classController.addLecture)
    .get(classController.getLectureClass);
module.exports=router;