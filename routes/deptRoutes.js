const express= require('express');
const deptController=require('../controllers/deptController');

const router=express.Router();

router
    .route('/')
    .post(deptController.addDept)
    .get(deptController.getAllDept);
module.exports=router;