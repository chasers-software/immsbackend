const express= require('express');
const postController=require('../controllers/postController');
const authController=require('../controllers/authController');

const router=express.Router();


router
    .route('/')
    .post(postController.addPost)
    .get(postController.getAllPost);
module.exports=router;
