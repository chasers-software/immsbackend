const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

//router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.protect);
router.route('/changePassword')
    .post(authController.restrictTo(0,1,2),userController.changePassword);
router.route('/teacher/delete/:person_id')
    .patch(userController.deleteTeacher);
    
router.route('/teacher/:person_id')
    .get(authController.restrictTo(0),userController.getTeacher)
    .patch(authController.restrictTo(0),userController.updateTeacher);

router.route('/teacher')
    .post(authController.restrictTo(0),userController.addTeacher)
    .get(authController.restrictTo(0),userController.getTeachers);
// router.route('/student/:person_id')
//     .get(userController.getStudent)
//     .patch(userController.updateStudent);
router.route('/student')
    .get(authController.restrictTo(0),userController.getAllStudent);

module.exports=router;
