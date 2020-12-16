const express= require('express');
const batchController=require('../controllers/batchController');

const router=express.Router();

router
    .route('/')
    .post(batchController.addBatch)
    .get(batchController.getAllBatch);

module.exports=router;