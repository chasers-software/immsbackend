const express= require('express');
const batchController=require('../controllers/batchController');
const authController=require('../controllers/authController');
const router=express.Router();
router.use(authController.protect);

router
    .route('/')
    .post(authController.restrictTo(0),batchController.addBatch)
    .get(authController.restrictTo(0),batchController.getAllBatch);
router
    .route('/newSession')
    .post(authController.restrictTo(0),batchController.newSession);
router
    .route('/stats')
    .get(authController.restrictTo(0),batchController.getStats);
module.exports=router;