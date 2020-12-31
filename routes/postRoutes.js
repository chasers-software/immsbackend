const express= require('express');
const postController=require('../controllers/postController');
const authController=require('../controllers/authController');

const router=express.Router();
router.use(authController.protect);


router
    .route('/')
    .post(authController.restrictTo(0,1,2),postController.addPost)
    .get(authController.restrictTo(0,1,2),postController.getAllPost);
module.exports=router;
