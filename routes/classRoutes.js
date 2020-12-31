const express= require('express');
const classController=require('../controllers/classController');
const authController=require('../controllers/authController');


const router=express.Router();
router.use(authController.protect);

router
    .route('/section')
    .get(classController.getAllSection);
router
    .route('/students/:section_code')
    .get(classController.getSectionStudents);

router.route('/lecture/:lecture_id')
.delete(authController.restrictTo(0),classController.deleteLecture);

router.route('/lecture')
    .post(authController.restrictTo(0),classController.addLecture)
    .get(classController.getLectureClass);
module.exports=router;