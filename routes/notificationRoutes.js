const express= require('express');
const notificationController=require('../controllers/notificationController');

const router=express.Router();


router
    .route('/')
    .post(notificationController.addNotification)
    .get(notificationController.getAllNotification);
module.exports=router;
