const express= require('express');
const programController=require('../controllers/programController');

const router=express.Router();

router
    .route('/')
    .post(programController.addProgram)
    .get(programController.getPrograms);
router
    .route('/subject')
    .get(programController.getSubjectsInProgram);
module.exports=router;