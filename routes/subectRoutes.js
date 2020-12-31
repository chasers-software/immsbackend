const express= require('express');
const subjectController=require('../controllers/subjectController');
const authController=require('../controllers/authController');

const router=express.Router();
router.use(authController.protect);

router.route('/syllabus')
    .post(authController.restrictTo(0),subjectController.addSubjects);
// router
//     .route('/')
//     .post(subjectController.addSubject);
module.exports=router;