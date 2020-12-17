const express= require('express');
const notificationController=require('../controllers/notificationController');

const router=express.Router();


router
    .route('/')
    .post(notificationController.addNotification)
    .get(notificationController.getAllNotification);
router
    .route('/report')
    .post(notificationController.report);
module.exports=router;
