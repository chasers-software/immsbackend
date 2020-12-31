const express= require('express');
const deptController=require('../controllers/deptController');
const authController=require('../controllers/authController');

const router=express.Router();
router.use(authController.protect);

router
    .route('/')
    .post(authController.restrictTo(0),deptController.addDept)
    .get(authController.restrictTo(0),deptController.getAllDept);
module.exports=router;