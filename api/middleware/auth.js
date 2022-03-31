const jwt = require('jsonwebtoken');
require('dotenv').config();
const Student = require('../model/studentschema');


module.exports.auth = (req, res, next) => { 
   try {
       const token = req.headers.authorization.split(" ")[1];   // bearer "token"
       console.log("sd");
       console.log(token);
      // console.log(verify.email);
       const verify = jwt.verify(token, process.env.TOKEN);  
       console.log(verify);
       console.log(verify.email);
       if (verify.email == "ayush2@gmail.com") {
           next();
       } else {
           return res.json({ msg: "not admin" })
       }
       // console.log(verify);
      //  next();
   } catch (error) {
       console.log("hhh");
       return res.status(401).json({ msg: error.message });  //will itself notify about token (not a valid or not)
    }
}




module.exports.personalauth = (req, res, next) => {                     // did compare with data
    Student.findOne({ _id: req.params.id }).then((data) => {
        console.log("ahhh");
        if (data == null) {
            return res.status(404).json({ msg: "not a valid id/ user not exist" });
        }
        else {
            console.log(data);
            //  try {
            const token = req.headers.authorization.split(" ")[1];   // bearer "token"
            const verify = jwt.verify(token, process.env.TOKEN);
            console.log("faf", verify.email);
            console.log("dad", data.email);
            if (verify.email == data.email) {

                req.isemail = verify.email;
                next();
            }
            else {
                //console.log("not a verified user");
                throw new Error("not a verified user");
                //return res.stutus(404).json({ msg: "not a verified user" });
                // next();
            }
            // console.log(verify);
            //  next();
            //} catch (error) {
            //    console.log("fa");
            //    return res.status(401).json({ msg: "not a valid token" });
            //}

        }
    },
        error => { console.log("afa"); res.status(404).json({ msg: error}); }).catch(error => { console.log("lll");return res.status(500).json({ msg: error.message }); });
}


module.exports.logedinusermeauth = (req, res, next) => {    // didn't compare with data
    try {
        const token = req.headers.authorization.split(" ")[1];   // bearer "token"
       // console.log("sd");
       // console.log(token);
        // console.log(verify.email);
        const verify = jwt.verify(token, process.env.TOKEN);
       // console.log(verify);
       // console.log(verify.email);
        if (verify.email) {
       //     console.log("fa");
            req.isemail = verify.email;
            next();
       //     console.log("dfa");
        } else {
            return res.json({ msg: "user not exist" })
        }
        // console.log(verify);
        //  next();
    } catch (error) {
        return res.status(401).json({ msg: error.message });    // not a valid token
    }

        }
   // }
    //    error => { console.log("afa"); res.status(404).json({ msg: "error" }); }).catch(error => { console.log("faf"); return res.status(500).json({ msg: error.message }); });















module.exports.logedinuser = (req, res, next) => {
    Student.findOne({ email: req.isemail },).then((data) => {
        if (data['token'] == null) {  // token in our database
            console.log("fdf");
            return res.status(404).json({ msg: "not a valid user / logged out" });
        }
        else { next();}
    },
    error => {
            return res.status(404).json({ msg: "invalid id" })
        }).catch(err => {
            return res.status(500).json({msg:err.message})});
}





module.exports.logedinuserme = (req, res, next) => {
    Student.findOne({ email: req.isemail},).then((data) => {
        if (data['token'] == "") {  // token in our database
            return res.status(404).json({ msg: "not a valid user / logged out" });
        }
        else { next(); }
    }
        ,
        error => {
            return res.status(404).json({ msg: "invalid user" });
        }

    ).catch(err => {
        return res.status(500).json({ msg: err.message })
    });
}
