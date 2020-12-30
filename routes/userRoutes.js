const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

//router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
//router.use(authController.protect);

router.route('/teacher/delete/:person_id')
    .patch(userController.deleteTeacher);
    
router.route('/teacher/:person_id')
    .get(userController.getTeacher)
    .patch(userController.updateTeacher);

router.route('/teacher')
    .post(userController.addTeacher)
    .get(userController.getTeachers);
// router.route('/student/:person_id')
//     .get(userController.getStudent)
//     .patch(userController.updateStudent);
router.route('/student')
    .get(userController.getAllStudent);

module.exports=router;
