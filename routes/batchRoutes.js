const express= require('express');
const batchController=require('../controllers/batchController');
const authController=require('../controllers/authController');
const router=express.Router();
router.use(authController.protect);

router
    .route('/')
    .post(batchController.addBatch)
    .get(batchController.getAllBatch);

module.exports=router;