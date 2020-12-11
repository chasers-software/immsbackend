const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

//router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.route('/teacher')
    .post(userController.addTeacher)
    .get(userController.getTeacher);
module.exports=router;
