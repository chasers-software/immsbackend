const express= require('express');
const programController=require('../controllers/programController');
const authController=require('../controllers/authController');

const router=express.Router();
router.use(authController.protect);

router
    .route('/')
    .post(programController.addProgram)
    .get(programController.getPrograms);
router
    .route('/subject')
    .get(programController.getSubjectsInProgram);
module.exports=router;