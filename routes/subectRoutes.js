const express= require('express');
const subjectController=require('../controllers/subjectController');
const authController=require('../controllers/authController');

const router=express.Router();
router.use(authController.protect);

router.route('/syllabus')
    .post(subjectController.addSubjects);
// router
//     .route('/')
//     .post(subjectController.addSubject);
module.exports=router;