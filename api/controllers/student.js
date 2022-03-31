const express = require('express');
const router = express.Router();

const Student = require('../model/studentschema');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth, personalauth ,logedinuser,logedinuserme } = require('../middleware/auth');
require('dotenv').config();


const Joi = require('joi')
const { joivalidation, joivalidationput, joipassword, joilogin}= require('../validations/schemavalid');
//const studentvalidator = require('../validations/schemavalid');
//const {validate} = require('express-validation');




/*
const searching = (req, res, next) => {
   // console.log("adfaf");
    let a = Object.keys(req.query);
    let b = Object.values(req.query);
    Student.find(
        "$or"[
        { "name": { "$regex": b[0], "$options": "i" } },
        { "email": { "$regex": b[0], "$options": "i" } },
        { "phone": { "$regex": b[0], "$options": "i" } },
        { "gender": { "$regex": b[0], "$options": "i" } }
        ]
       // {
           // "name": "ayush"
           // "Country": "Germany"
       // }
        //{
        //    "$or": [
        //        { "name": { $regex: req.params.key } },
        //        { "email": { $regex: req.params.key } },
        //        { "phone": { $regex: req.params.key } },
        //        { "gender": { $regex: req.params.key } }
        //    ]
        //}
    ).then(data => { return res.json({ msg: data }); });
}

*/






const me = (req, res, next) => {

    Student.findOne({ email: req.isemail }).then((data) => {

       return res.json({ msg: data });

    });

}



const signup = (req, res) => {
    Student.findOne({ email: req.body.email }).then((data) => {
        if (data == null) {

            let answer = joivalidation.validate(req.body);
            if (answer.error) {
                return res.status(400).json({ msg: answer.error.details[0].message });
            }
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err })
                }
                else {

                    /*
                    Student.create ({
                        name: req.body.name,
                        email: req.body.email.toLowerCase(),
                        password: hash,
                        phone: parseInt(req.body.phone),
                        gender: req.body.gender.toLowerCase(),
                        isActive: req.body.isActive,
                    },
                        function (err, student) {
                            if (err) return res.status(500).send("There was a problem registering the user.")
                            // create a token
                            console.log(student);
                            var token = jwt.sign({
                                id: student.id,
                                name: student.name,
                                email: student.email,
                                phone: student.phone,
                                gender: student.gender
                            }, process.env.TOKEN, { expiresIn: '6h' });
                            console.log(token);
                            return res.status(200).send({ new_user: student });
                        });
                        */

                    
                   // console.log("anf");

                    const student = new Student({
                       // id: mongoose.Types.ObjectId,
                        name: req.body.name,
                        email: req.body.email.toLowerCase(),
                        password: hash,
                        phone: parseInt(req.body.phone),
                        gender: req.body.gender.toLowerCase(),
                        isActive: req.body.isActive,

                    })
                    console.log("afa" + student);
                    const token = jwt.sign({
                       // id:student._id,
                        name: student.name,
                        email: student.email,
                        phone: student.phone,
                        gender: student.gender
                    }, process.env.TOKEN, { expiresIn: '6h' });

                    const studenttoken = new Student({
                        name: req.body.name,
                        email: req.body.email.toLowerCase(),
                        password: hash,
                        phone: parseInt(req.body.phone),
                        gender: req.body.gender.toLowerCase(),
                        isActive: req.body.isActive,
                        token: token
                    })


                    studenttoken.save().then (result => {
                        console.log("faf" + studenttoken);
                       return res.status(200).json({ new_user: result })

                    }).catch(err => { return res.status(500).json({ error: err }) });

                    
                }
            })
        }
        else {
            return res.status(401).json({ msg: 'email exist' });
        }
    })
};



const deletedusers= (req, res, next) => {
    Student.find().then(result => {
        const filters = req.query;
        //for (key in filters) {
        //    if (key != "name" && key != "email" && key != "phone" && key != "gender") {
        //        return res.status(404).json({ msg: " not a valid query" });
        //    }
        //    else {
        const filteredUsers = result.filter(user => {
            //if(user.isActive)
            let isValid = true;
            if (user['isActive'] == false) {
                for (key in filters) {
                    //console.log(key, user[key], filters[key]);
                    // console.log(isValid);
                    if (key == 'phone') {
                        isValid = isValid && (user['isActive'] == false && (user[key].toString().substr(0, filters[key].toString().length) == filters[key].toString()));
                    }
                    else if (key == 'name' || key == 'email' || key == 'gender') {
                        isValid = isValid && (user['isActive'] == false && (user[key].toLowerCase().substr(0, filters[key].length) == filters[key]));
                    }

                    else {
                        throw new Error("not a valid query");
                    }

                    // console.log(isValid);
                }
            }
            else { isValid = false; }
            //console.log(isValid);
            return isValid;
        },
            error => { res.status(404).json({ msg: "not a valid query" }); }

        );
        //console.log(filteredUsers);
        if (filteredUsers.length == 0) {
            return res.status(200).json({ msg: "no user with such query" });
        }
        else {
            return res.status(200).json(filteredUsers);
        }
        //    }
        //}

        // res.status(200).json({ studentData: result });
    }).catch(err => {
        //console.log(err);
       return res.status(500).json({ error: err.message })
    });



    //res.status(200).json({ msg: 'this is student get request' })
};




const search=(req, res, next) => {
    Student.find().then(result => {
        const filters = req.query;
        //for (key in filters) {
        //    if (key != "name" && key != "email" && key != "phone" && key != "gender") {
        //        return res.status(404).json({ msg: " not a valid query" });
        //    }
        //console.log(filters);
        console.log("ayush");
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(ip);
        //    else {
        const filteredUsers = result.filter(user => {
                                                    //  filters ={} when no query so loop will not execute all user will get isvalid=true;
            let isValid = true;
            if (user['isActive'] == true) {

                for (key in filters) {                                    //if two query loop will execute for 2 times for each user
                    //console.log(key, user[key], filters[key]);
                    // console.log(isValid);
                    if (key == 'phone') {
                        isValid = isValid && (user['isActive'] == true && (user[key].toString().substr(0, filters[key].toString().length) == filters[key].toString()));
                    }
                    else if (key == 'name' || key == 'email' || key == 'gender') {
                        isValid = isValid && (user['isActive'] == true && (user[key].toLowerCase().substr(0, filters[key].length) == filters[key]));
                    }

                    else {
                        throw new Error("not a valid query" );
                    }
                    // console.log(isValid);
                }
            }
            else { isValid = false; }
            //console.log(isValid);
            return isValid;
        }
            ,
            error => { res.status(404).json({ msg: "error" }); })
               if (filteredUsers.length == 0) {
            return res.status(200).json({ msg: "no user with such query" });
        }
               else {
                   console.log(filteredUsers[3]._id);
            return res.status(200).json(filteredUsers);
        }

    }).catch(err => {
        //console.log(err);
        return res.status(500).json({ error: err.message });
    });


};


const deletedusersbyid = (req, res) => {
    Student.findById(req.params.id).then(result => {
        if (result["isActive"] == false) {
            return res.status(200).json({ student: result });
        }
        else {
            return res.status(404).json({ msg: "user is active" });
        }
    },
        error => { res.status(404).json({ msg: "not a valid id" }); }
    ).catch(err => {
        console.log(err);
        return res.status(500).json({ error: err })
    });



};



const searchbyid= (req, res) => {
    Student.findById(req.params.id).then(result => {
        if (result['isActive'] == true) {
            return res.status(200).json({ student: result });
        }
        else {
            return res.status(404).json({ msg: "user is not active anymore" });
        }
    },
        error => { res.status(404).json({ msg: "not a valid id" }); }
    ).catch(err => {
        console.log(err);
       return  res.status(500).json({ error: err })
    });
};


const deletebyid = (req, res) => {
    Student.findById(req.params.id).then (result => {
        if (result['email'] != 'ayush2@gmail.com') {
            let isActive = result['isActive'] = false;

            Student.updateOne({ _id: req.params.id }, {
                $set: {
                    isActive: isActive
                }
            },
                { upsert: true }).then(result => { res.status(200).json({ update: result }) });

        } else {
            return res.status(401).json({ msg: "can't delete admin" });
        }

    },
        error => (res.status(404).json({ msg: "not a vallid id" }))).catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });



};


const update= (req, res) => {                                   // bearer token
    Student.findOne({ _id: req.params.id },).then((data) => {
       
        if (data == null) {

            res.json({ msg: "user not exists" });

        } else {
            let name, email, phone, gender,token;

                if (req.body.name != "") {
                     name = req.body.name == undefined ? data.name : req.body.name;

                }
                else {
                    return res.status(404).json({ msg: "name field can't be empty" });
                }
 


          //  if (req.body.email != undefined) {
                if (req.body.email != "") {

                    if (req.body.email != undefined && req.body.email.toLowerCase() != data.email.toLowerCase()) {

                        return res.status(404).json({ msg: "can't update email" });
                    }
                    //else {
                        email = req.body.email == undefined ? data.email : req.body.email.toLowerCase();
                  //  }
                }
                else {
                    return res.status(404).json({ msg: "email field can't be empty" });
                }
            //}
            //else {
            //    email = email;
            //}

          
                if (req.body.phone!= "") {
                     phone = req.body.phone == undefined ? data.phone : req.body.phone;
                }
                else {
                    return res.status(404).json({ msg: "phone field can't be empty" });
                }
    

                if (req.body.gender != "") {
                    gender = req.body.gender == undefined ? data.gender : req.body.gender;


                }
                else {
                    return res.status(404).json({ msg: "gender field can't be empty" });
                }
  


            let answer = joivalidationput.validate(req.body);

            if (answer.error) {
                return res.status(400).json({ msg: answer.error.details[0].message });
            }



            Student.updateOne({ _id: req.params.id }, {
                $set: {
                    name: name,
                    email: email,
                    //password: password,
                    phone: phone,
                    gender: gender,
                    token: data.token

                }

            },
                { upsert: true }).then(result => { res.status(200).json({ update: result }) });

        }
        // }
    },
        error => { res.status(404).json({ msg: "not a valid id" }); }

    );
};





const updatepassword=(req, res) => {  // bearer token
    Student.findOne({ _id: req.params.id },).then((data) => {
        console.log("ayush");
        if (data == null) {

            return res.json({ msg: "user not exists" });

        } else {

            let password;

            // if (req.body.password != null) {
            if (req.body.password == "") {
                return res.status(404).json({ msg: "password field can't be empty" });
            }
            else {
                password = req.body.password == undefined ? data.password : req.body.password;

                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) {
                        throw err;
                    } else {
                      //  password = req.body.password == undefined ? data.password : req.body.password;


                        let answer = joipassword.validate(req.body);

                        if (answer.error) {
                            return res.status(400).json({ msg: answer.error.details[0].message });
                        }


                        Student.updateOne({ _id: req.params.id }, {
                            $set: {
                                password: hash,

                            }
                        },
                            { upsert: true }).then(result => { return res.status(200).json({ update: result }) });
                    }
                });
            }
            //else {
            //    return res.status(404).json({ msg: "password field can't be empty" });
            //}
            //      }

            //let answer = joipassword.validate(req.body);

            //if (answer.error) {
            //    return res.status(400).json({ msg: answer.error.details[0].message });
            //}



            //Student.updateOne ({ _id: req.params.id }, {
            //    $set: {
            //        password: password
            //    }

            //},
            //    { upsert: true }).then (result => {return res.status(200).json({ update: result }) });

        }
        //  }
    },
        error => { return res.status(404).json({ msg: "not a valid id" }); }

    ).catch(err => { return res.status(500).json({msg:err})});
};




const login= (req, res) => {
    Student.find({ email: req.body.email })
        .exec()
        .then(student => {


            let answer = joilogin.validate(req.body);
            if (answer.error) {
                return res.status(400).json({ msg: answer.error.details[0].message });
            }

            if (student.length == 0) {               // when no student found with the same email        array of objects
                return res.status(401).json({
                    msg: 'no user with this email'
                })
            }

            bcrypt.compare(req.body.password, student[0].password, (err, result) => {
                if (!result) {
                    return res.status(401).json({
                        msg: 'password matching fail'
                    })
                }
                if (result) {
                 //   console.log(student[0]._id);
                    const token = jwt.sign({
                        
                        name: student[0].name,
                        email: student[0].email,
                        phone: student[0].phone,
                        gender: student[0].gender
                    }, process.env.TOKEN, { expiresIn: '6h' });

                    // if already signup then shouldn't update
                    Student.updateOne({ email: req.body.email.toLowerCase() }, {
                        $set: {
                            token: token,

                        }
                    },
                        { upsert: true }).then(result => {
                            res.status(200).json({
                                name: student[0].name,
                                email: student[0].email,
                                phone: student[0].phone,
                                gender: student[0].gender,
                                token: token
                            })
                        });




                }
            })
        }).catch(err => {return  res.status(500).json({ eror: err }); });
};



const logout= function (req, res) {
    Student.findOne({ email: req.isemail }).then((data) => {
        if (data['token'] == "") {
            res.json({ msg: "already logged out" });
        }
        else {
            //data['token'] = "";
            Student.updateOne({ email: data.email }, { $set: { token: "" } }, { upsert: true }
            ).then(result => {return  res.status(200).json({ msg: "logged out" }) });
        }
    });

};





































//router.post('/', (req, res) => {
//    Student.findOne({ email: req.body.email }).then((data) => {
//        if (data == null) {

//            let answer = joivalidation.validate(req.body);

//            if (answer.error) {
//                return res.status(400).json({ msg: answer.error.details[0].message });
//            }


//            //if (!req.body.name || !req.body.email || !req.body.password.toLowerCase() || !req.body.gender) {
//            //    return res.status(404).json({ msg: "empty fields" });
//            //    next();
//            //    res.end();
//            //}

//            //if (req.body.name.length < 1 && name.length > 20)
//            //    return res.status(401).json({ msg: "name length must not greater than 20" });

//            //let emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//            //if (!emailregex.test(req.body.email.toLowerCase()))
//            //    return res.status(401).json({ msg: "not a valid email" });

//            //let passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,10}$/;
//            //if (!passregex.test(req.body.password))
//            //    return res.status(401).json({ msg: 'a password must be between 3 to 10 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' });

//            //let phoneregex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
//            //if (!phoneregex.test(req.body.phone))
//            //    return res.status(401).json({ msg: "not a valid no." });

//            //if (req.body.gender.toLowerCase() != 'male' && req.body.gender.toLowerCase() != 'female') {
//            //    return res.status(404).json({ msg: "gender must be male or female" });
//            //}


//            bcrypt.hash(req.body.password, 10, (err, hash) => {
//                if (err) {
//                    return res.status(500).json({ error: err })
//                }
//                else {
//                    const student = new Student({
//                        name: req.body.name,
//                        email: req.body.email.toLowerCase(),
//                        password: hash,
//                        phone: parseInt(req.body.phone),
//                        gender: req.body.gender.toLowerCase(),
//                        isActive: req.body.isActive
//                    })
//                    student.save().then(result => {
//                        res.status(200).json({ new_user: result })

//                    }).catch(err => { res.status(500).json({ error: err }) });
//                }
//            })
// /*
//            const student = new Student({
//                //_id: new mongoose.Types.ObjectId, // new id for frontend
//                name: req.body.name,
//                email: req.body.email,
//                password:req.body.password,
//                phone: req.body.phone,
//                gender: req.body.gender
//            });
//            student.save().then(result => {//
//                console.log(result);
//                return res.status(200).json({ newStudent: result })
//            })
        
//*/
//            // console.log(req.body); res.status(200).json({ msg: 'this is student post request' });
//        }
//        else {
//            res.status(401).json({ msg: 'email exist' });
//        }
//    },
//        (error) => {
//            res.status(404).json({ msg: error });
//        }).catch(err => { res.status(500).json({ error: err }) });
//});









//router.post('/signup', (req, res) => {
//    Student.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
//        if (data == null) {

//            let answer = joivalidation.validate(req.body);
//            if (answer.error) {
//                return res.status(400).json({ msg: answer.error.details[0].message });
//            }
//            bcrypt.hash(req.body.password, 10, (err, hash) => {
//                if (err) {
//                    return res.status(500).json({ error: err })
//                }
//                else {



//                    const student = new Student({
//                        name: req.body.name,
//                        email: req.body.email.toLowerCase(),
//                        password: hash,
//                        phone: parseInt(req.body.phone),
//                        gender: req.body.gender.toLowerCase(),
//                        isActive: req.body.isActive,
                       
//                    })

//                    const token = jwt.sign({
//                        name: student.name,
//                        email: student.email,
//                        phone: student.phone,
//                        gender: student.gender
//                    }, process.env.TOKEN, { expiresIn: '6h' });

//                    const studenttoken = new Student({
//                        name: req.body.name,
//                        email: req.body.email.toLowerCase(),
//                        password: hash,
//                        phone: parseInt(req.body.phone),
//                        gender: req.body.gender.toLowerCase(),
//                        isActive: req.body.isActive,
//                        token:token
//                    })


//                    studenttoken.save().then(result => {
//                        res.status(200).json({ new_user: result })

//                    }).catch(err => { res.status(500).json({ error: err }) });
//                }
//            })
//        }
//        else {
//            res.status(401).json({ msg: 'email exist' });
//        }
//    })
//});

































/*
router.get('/', (req, res, next) => {
    Student.find().then(result => {
        const filters = req.query;
        const filteredUsers = result.filter(user => {
            //if(user.isActive)
            let isValid = true;
            if (user['isActive'] == true)
                isValid = true;
            else
                isValid = false;
            //console.log(isValid);
            return isValid;
        });
        res.status(200).json(filteredUsers);

        // res.status(200).json({ studentData: result });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    });



    //res.status(200).json({ msg: 'this is student get request' })
});


*/




router.get('/me', personalauth, logedinuserme, (req, res, next) => {

    Student.findOne({ email: req.isemail }).then((data) => {

            res.json({ msg: data });

    });

})


//router.get('/deletedusers', auth,(req, res, next) => {
//    Student.find().then(result => {
//        const filters = req.query;
//        //for (key in filters) {
//        //    if (key != "name" && key != "email" && key != "phone" && key != "gender") {
//        //        return res.status(404).json({ msg: " not a valid query" });
//        //    }
//        //    else {
//            const filteredUsers = result.filter(user => {
//                //if(user.isActive)
//                let isValid = true;
//                if (user['isActive'] == false) {
//                    for (key in filters) {
//                        //console.log(key, user[key], filters[key]);
//                        // console.log(isValid);
//                        if (key == 'phone') {
//                            isValid = isValid && (user['isActive'] == false && (user[key].toString().substr(0, filters[key].toString().length) == filters[key].toString()));
//                        }
//                        else if (key == 'name' || key == 'email' || key == 'gender') {
//                            isValid = isValid && (user['isActive'] == false && (user[key].toLowerCase().substr(0, filters[key].length) == filters[key].toLowerCase()));
//                        }

//                        // console.log(isValid);
//                    }
//                }
//                else { isValid = false; }
//                //console.log(isValid);
//                return isValid;
//            },
//                error => { res.status(404).json({ msg: "not a valid query" }); }

//            );
//            res.status(200).json(filteredUsers);
//    //    }
//    //}

//        // res.status(200).json({ studentData: result });
//    }).catch(err => {
//        console.log(err);
//        res.status(500).json({ error: err })
//    });



//    //res.status(200).json({ msg: 'this is student get request' })
//});


























//router.get('/',(req, res,next) => {
//    Student.find().then(result => {
//        const filters = req.query;
//        //for (key in filters) {
//        //    if (key != "name" && key != "email" && key != "phone" && key != "gender") {
//        //        return res.status(404).json({ msg: " not a valid query" });
//        //    }

//        //    else {
//                const filteredUsers = result.filter  (user => {
//                    //if(user.isActive)
//                    let isValid = true;
//                    if (user['isActive'] == true) {
//                        for (key in filters) {
//                            //console.log(key, user[key], filters[key]);
//                            // console.log(isValid);
//                            if (key == 'phone') {
//                                isValid = isValid && (user['isActive'] == true && (user[key].toString().substr(0, filters[key].toString().length) == filters[key].toString()));
//                            }
//                            else if (key == 'name' || key == 'email' || key == 'gender') {
//                                isValid = isValid && (user['isActive'] == true && (user[key].toLowerCase().substr(0, filters[key].length) == filters[key].toLowerCase()));
//                            }

//                            // console.log(isValid);
//                        }
//                    }
//                    else { isValid = false; }
//                    //console.log(isValid);
//                    return isValid;
//                }
//                    ,
//                    error => { res.status(404).json({ msg: "error" }); })
//                return res.status(200).json(filteredUsers);
//      //      }
            
//     //   }
//        //console.log("afdasf");
            

//       // res.status(200).json({ studentData: result });
//    }).catch(err => {
//        console.log(err);
//        res.status(500).json({ error: err })
//    });



//    //res.status(200).json({ msg: 'this is student get request' })
//});

//router.get('/:id', (req, res) => {
//    Student.findById(req.params.id).then(result => {
//        res.status(200).json({ student: result });
//    },
//        error => { res.status(404).json({ msg: "not a valid id" });}
//        ).catch(err => {
//        console.log(err);
//        res.status(500).json({ error: err })
//    });


   
//});


////req.body.email for only email field








//router.delete('/:id',auth, (req, res) => {


//    Student.findById(req.params.id).then(result => {
//        if (result['email'] != 'ayush2@gmail.com') {
//            result['isActive'] = false;


//        let name = req.body.name == undefined ? result.name : req.body.name;

//        let password = req.body.password == undefined ? result.password : req.body.password;
//        let email = req.body.email == undefined ? result.email : req.body.email;

//        let phone = parseInt(req.body.phone) == undefined ? result.phone : parseInt(req.body.phone);
//        let gender = req.body.gender == undefined ? result.gender : req.body.gender;

//        let isActive = req.body.isActive == undefined ? result.isActive : req.body.isActive;
//        //res.status(200).json({ student: result });

//        Student.updateOne({ _id: req.params.id }, {

//            $set: {
//                name: name,
//                email: email,
//                password: password,
//                phone: phone,
//                gender: gender,
//                isActive: isActive
//            }

//        },
//            { upsert: true }).then(result => { res.status(200).json({ update: result }) });

//    }  else {
//        return res.status(401).json({ msg: "can't delete admin" });
//    }

//    },
//        error => (res.status(404).json({msg: "not a vallid id"}))).catch(err => {
//        console.log(err);
//        res.status(500).json({ error: err })
//    });


//    /*
//    Student.remove({ _id: req.params.id }
//    ).then(result => {
//        res.status(200).json({ msg: "deleted", result: result })
//    }).catch(err => {
//        console.log(err);
//        res.status(500).json({ error: err });
//    });*/

//});

////put request

//router.put('/update/:id', personalauth, logedinuser,(req, res) => {  // bearer token
//    Student.findOne({ _id: req.params.id },).then((data) => {
//        //if (data['token'] == "") {  // token in our database
//        //    return res.status(404).json({ msg: "not a valid user" });
//        //}

//        //else {
//            if (data == null) {

//                res.json({ msg: "user not exists" });

//            } else {

//                if (req.body.name != null) {
//                    if (req.body.name.trim() != "") {
//                        var name = req.body.name == undefined ? data.name : req.body.name;
 
//                    }
//                    else {
//                        return res.status(404).json({ msg: "name field can't be empty" });
//                    }
//                }


//                if (req.body.email != null) {
//                    if (req.body.email.trim() != "") {
//                        //var email = req.body.email == undefined ? data.email : req.body.email;  
 
//                        //var email = req.body.email.toLowerCase() == undefined ? data.email : req.body.email.toLowerCase();
//                        if (req.body.email.toLowerCase() != data.email.toLowerCase()) {

//                            return res.status(404).json({ msg: "can't update email" });
//                        }
//                        else {
//                            var email = req.body.email.toLowerCase() == undefined ? data.email : req.body.email.toLowerCase();
//                        }
//                    }
//                    else {
//                        return res.status(404).json({ msg: "email field can't be empty" });
//                    }
//                }


//                /*
//                let password;

//                if (req.body.password != null) {
//                    if (req.body.password.trim() != "") {
//                        bcrypt.hash(req.body.password, 10, function (err, hash) {

//                            if (err) {

//                                throw err;

//                            } else {
//                                password = req.body.password == undefined ? data.password :hash;                
//                            }
//                        });
//                    }
//                    else {
//                        return res.status(404).json({ msg: "password field can't be empty" });
//                    }
//                }


//*/

//                if (req.body.phone != null) {
//                    if (req.body.phone.trim() != "") {
//                        var phone = parseInt(req.body.phone) == undefined ? data.phone : parseInt(req.body.phone);
//                    }
//                    else {
//                        return res.status(404).json({ msg: "phone field can't be empty" });
//                    }
//                }

//                if (req.body.gender != null) {
//                    if (req.body.gender.trim() != "") {
//                        var gender = req.body.gender == undefined ? data.gender : req.body.gender;
   

//                    }
//                    else {
//                        return res.status(404).json({ msg: "gender field can't be empty" });
//                    }
//                }

//                let answer = joivalidationput.validate(req.body);

//                if (answer.error) {
//                    return res.status(400).json({ msg: answer.error.details[0].message });
//                }



//                Student.updateOne({ _id: req.params.id }, {
//                    $set: {
//                        name: name,
//                        email: email,
//                        //password: password,
//                        phone: phone,
//                        gender: gender
                  
//                    }

//                },
//                    { upsert: true }).then(result => { res.status(200).json({ update: result }) });

//            }
//       // }
//    },
//        error => { res.status(404).json({ msg: "not a valid id" }); }

//    );
//});

///*

//router.put('/:id', personalauth,(req, res) => {  // bearer token
//    Student.findOne({ _id: req.params.id },).then((data) => {
//        if (data['token'] == "") {  // token in our database
//            return res.status(404).json({ msg: "not a valid user" });
//        }

//        else {
//            if (data == null) {

//                res.json({ msg: "user not exists" });

//            } else {


//                let answer = joivalidationput.validate(req.body);

//                if (answer.error) {
//                    return res.status(400).json({ msg: answer.error.details[0].message });
//                }
//                if (req.body.password == null) {
//                    return res.status(404).json({ msg: "can't change without a password" });
//                }
//                else {
//                bcrypt.hash(req.body.password, 10, function (err, hash) {

//                    if (err) {

//                        throw err;

//                    } else {
//                        let name = req.body.name == undefined ? data.name : req.body.name;                                                            //undefined means no coloumn    and    null means empty string

//                        let password = req.body.password == undefined ? data.password : req.body.password;
//                        let email = req.body.email.toLowerCase() == undefined ? data.email : req.body.email.toLowerCase();
//                        if (req.body.email.toLowerCase() != data.email.toLowerCase()) {

//                            return res.status(404).json({ msg: "can't update email" });
//                        }
//                        let phone = parseInt(req.body.phone) == undefined ? data.phone : parseInt(req.body.phone);
//                        let gender = req.body.gender == undefined ? data.gender : req.body.gender;

//                        let isActive = req.body.isActive == undefined ? data.isActive : req.body.isActive;



//                        Student.updateOne({ _id: req.params.id }, {
//                            $set: {
//                                name: name,
//                                email: email,
//                                password: hash,
//                                phone: phone,
//                                gender: gender,
//                                isActive: isActive
//                            }

//                        },
//                            { upsert: true }).then(result => { res.status(200).json({ update: result }) });
//                    }
//                });
//            }

//        }
//}
//    },
//        error => { res.status(404).json({ msg: "not a valid id" }); }

//    ); 
//});


//*/


//router.put ('/password/:id', personalauth,logedinuser, (req, res) => {  // bearer token
//    Student.findOne({ _id: req.params.id },).then((data) => {
//        //if (data['token'] == "") {  // token in our database
//        //    return res.status(404).json({ msg: "not a valid user" });
//        //}

//        //else {
//            if (data == null) {

//                res.json({ msg: "user not exists" });

//            } else {

//                let password;

//                if (req.body.password != null) {
//                    if (req.body.password.trim() != "") {
//                        bcrypt.hash(req.body.password, 10, function (err, hash) {
//                            if (err) {
//                                throw err;
//                            } else {
//                                let password = req.body.password == undefined ? data.password : req.body.password;


//                                let answer = joipassword.validate(req.body);

//                                if (answer.error) {
//                                    return res.status(400).json({ msg: answer.error.details[0].message });
//                                }


//                                Student.updateOne({ _id: req.params.id }, {
//                                    $set: {
//                                        password: hash,

//                                    }
//                                },
//                                    { upsert: true }).then(result => { res.status(200).json({ update: result }) });
//                            }
//                        });
//                    }
//                    else {
//                        return res.status(404).json({ msg: "password field can't be empty" });
//                    }
//                }

//                let answer = joipassword.validate(req.body);

//                if (answer.error) {
//                    return res.status(400).json({ msg: answer.error.details[0].message });
//                }



//                Student.updateOne({ _id: req.params.id }, {
//                    $set: {
//                        password: password
//                    }

//                },
//                    { upsert: true }).then(result => { res.status(200).json({ update: result }) });

//            }
//      //  }
//    },
//        error => { res.status(404).json({ msg: "not a valid id" }); }

//    );
//});




///*
//router.put('/password/:id', personalauth, (req, res) => {
//    student.findone({ _id: req.params.id },).then((data) => {
//        if (data['token'] == "") {
//            return res.status(404).json({ msg: "not a valid user" });
//        }

//        else {
//        if (data == null) {

//            res.json({ msg: "user not exists" });

//        } else {

//            let answer = joivalidation.validate(req.body.password);
//            // let answer = joi.validate(req.body, joivalidation);
//            if (answer.error) {//400 // bad request 
//                return res.status(400).json({ msg: answer.error.details[0].message });
//            }


//            //let passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[a-z])(?=.*[^a-za-z0-9])(?!.*\s).{3,10}$/;
//            //if (!passregex.test(req.body.password))
//            //    return res.status(401).json({ msg: 'a password must be between 3 to 10 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' });


//            bcrypt.hash(req.body.password, 10, function (err, hash) {
//                if (err) {
//                    throw err;
//                } else {
//                    let password = req.body.password == undefined ? data.password : req.body.password;

//                    student.updateone({ _id: req.params.id }, {
//                        $set: {
//                            password: hash,

//                        }
//                    },
//                        { upsert: true }).then(result => { res.status(200).json({ update: result }) });
//                }
//            });

//        }

//    } },
//        error => { res.status(404).json({ msg: "not a valid id" }); }
//    );
//});

//*/












///*
//    Student.findOneAndUpdate({ _id: req.params.id },
//        {
//            set: {
//                name: req.body.name,
//                email: req.body.email,
//                password: req.body.password,
//                phone: req.body.phone,
//                gender: req.body.gender
//            }
           
//    }).then(result => {
//        res.status(200).json({ updated: result })
//    }).catch(err => { res.status(500).json({error:err})}) */




//router.post('/login', (req, res) => {
//    Student.find({ email: req.body.email})
//        .exec()
//        .then(student => {


//            let answer = joilogin.validate(req.body);
//            if (answer.error) {
//                return res.status(400).json({ msg: answer.error.details[0].message });
//            }

//            if (student.length ==0) {               // when no student found with the same email        array of objects
//                return res.status(401).json({
//                    msg: 'no user with this email'
//                })
//            }






//            bcrypt.compare(req.body.password, student[0].password, (err, result) => {
//                if (!result) {
//                    return res.status(401).json({
//                        msg: 'password matching fail'
//                    })
//                }
//                if (result) {
//                    const token = jwt.sign({
//                        name: student[0].name,
//                        email: student[0].email,
//                        phone: student[0].phone,
//                        gender: student[0].gender
//                    },process.env.TOKEN, { expiresIn: '6h' });

//                    // if already signup then shouldn't update
//                    Student.updateOne({ email: req.body.email.toLowerCase() }, {
//                        $set: {
//                            token:token,

//                        }
//                    },
//                        { upsert: true }).then(result => {
//                            res.status(200).json({
//                                name: student[0].name,
//                                email: student[0].email,
//                                phone: student[0].phone,
//                                gender: student[0].gender,
//                                token: token
//                            })});




//                }
//            })
//        }).catch(err => { res.status(500).json({ eror: err }); });
//        });




//router.post("/logout", personalauth, function (req, res) {
//    Student.findOne({ email: req.isemail }).then((data) => {
//        if (data['token'] == "") {
//            res.json({ msg: "already logged out" });
//        }
//        else {
//            //data['token'] = "";
//            Student.updateOne({ email: data.email }, { $set: { token: "" } }, { upsert: true }
//            ).then(result => { res.status(200).json({ msg: "logged out" }) });
//        }
//    });

//});

















/*
router.put("/logout", personalauth, function (req, res) {
    const authHeader = req.headers["authorization"];
    jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
        if (logout) {
            res.send({ msg: 'You have been Logged Out' });
        } else {
            res.send({ msg: 'Error' });
        }
    });
});
*/






module.exports = { router, me, signup, deletedusers,deletedusersbyid,search ,searchbyid ,deletebyid ,update, updatepassword ,login  ,logout  };



