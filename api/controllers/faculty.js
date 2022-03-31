
/*

const express = require('express');
const router = express.Router();

const Faculty = require('../model/studentschema');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth, personalauth, logedinuser, logedinuserme } = require('../middleware/auth');
require('dotenv').config();

//const Joi = require('joi');
const Joi = require('joi')
const { joivalidation, joivalidationput, joipassword, joilogin } = require('../validations/schemavalid');
//const studentvalidator = require('../validations/schemavalid');
//const {validate} = require('express-validation');


router.post('/', (req, res) => {
    Faculty.findOne({ email: req.body.email }).then((data) => {
        if (data == null) {

            let answer = joivalidation.validate(req.body);

            if (answer.error) {
                return res.status(400).json({ msg: answer.error.details[0].message });
            }


            //if (!req.body.name || !req.body.email || !req.body.password.toLowerCase() || !req.body.gender) {
            //    return res.status(404).json({ msg: "empty fields" });
            //    next();
            //    res.end();
            //}

            //if (req.body.name.length < 1 && name.length > 20)
            //    return res.status(401).json({ msg: "name length must not greater than 20" });

            //let emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            //if (!emailregex.test(req.body.email.toLowerCase()))
            //    return res.status(401).json({ msg: "not a valid email" });

            //let passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,10}$/;
            //if (!passregex.test(req.body.password))
            //    return res.status(401).json({ msg: 'a password must be between 3 to 10 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' });

            //let phoneregex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
            //if (!phoneregex.test(req.body.phone))
            //    return res.status(401).json({ msg: "not a valid no." });

            //if (req.body.gender.toLowerCase() != 'male' && req.body.gender.toLowerCase() != 'female') {
            //    return res.status(404).json({ msg: "gender must be male or female" });
            //}


            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err })
                }
                else {
                    const student = new Faculty({
                        name: req.body.name,
                        email: req.body.email.toLowerCase(),
                        password: hash,
                        phone: parseInt(req.body.phone),
                        gender: req.body.gender.toLowerCase(),
                        isActive: req.body.isActive
                    })
                    student.save().then(result => {
                        res.status(200).json({ new_user: result })

                    }).catch(err => { res.status(500).json({ error: err }) });
                }
            })

            /*
            const student = new Student({
                //_id: new mongoose.Types.ObjectId, // new id for frontend
                name: req.body.name,
                email: req.body.email,
                password:req.body.password,
                phone: req.body.phone,
                gender: req.body.gender
            });
            student.save().then(result => {//
                console.log(result);
                return res.status(200).json({ newStudent: result })
            })
        
        */
            // console.log(req.body); res.status(200).json({ msg: 'this is student post request' });
/*
        }

        else {
            res.status(401).json({ msg: 'email exist' });
        }
    },
        (error) => {
            res.status(404).json({ msg: error });
        }).catch(err => { res.status(500).json({ error: err }) });
});

module.exports = router;


*/