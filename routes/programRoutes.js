const express= require('express');
const programController=require('../controllers/programController');
const authController=require('../controllers/authController');

const router=express.Router();
router.use(authController.protect);

router
    .route('/')
    .post(authController.restrictTo(0),programController.addProgram)
    .get(authController.restrictTo(0),programController.getPrograms);
router
    .route('/subject')
    .get(authController.restrictTo(0),programController.getSubjectsInProgram);
module.exports=router;