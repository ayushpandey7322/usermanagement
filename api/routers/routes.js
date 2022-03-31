const express = require('express');
const router = express.Router();

//const Student = require('../model/studentschema');
//const mongoose = require('mongoose');

//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const { auth, personalauth, logedinuser, logedinuserme,logedinusermeauth } = require('../middleware/auth');
//require('dotenv').config();

////const Joi = require('joi');
//const Joi = require('joi')
//const { joivalidation, joivalidationput, joipassword, joilogin } = require('../validations/schemavalid');


const { me, signup, deletedusers, deletedusersbyid, search, searchbyid, deletebyid, update, updatepassword ,login ,logout } = require('../controllers/student');


//router.post('/signup', (req, res)

router.get('/me',logedinusermeauth, logedinuserme, me);
router.post('/signup', signup);
router.get('/deletedusers', auth, deletedusers);
router.get('/deletedusers/:id', auth, deletedusersbyid);
router.get('/',auth,search);
router.get('/:id',auth , searchbyid);
router.delete('/:id', auth, deletebyid);

router.put('/:id', personalauth, logedinuserme, update);
router.put('/password/:id', personalauth, logedinuserme, updatepassword);
router.post('/login', login);
router.post("/logout", logedinusermeauth, logout);

//router.get("/searching", searching);


module.exports = router;