const Joi = require('joi')
const joivalidation = Joi.object({
    name: Joi.string().trim().min(1).max(20).required(), //avi
    // email:Joi.string().email().lowercase().required(),
    // password:Joi.string().min(2).required(),
    //email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    email: Joi.string().lowercase().required().regex(RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)).message('not a valid email'),
    password: Joi.string().trim().required().regex(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,10}$/)).message('a password must be between 3 to 10 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
    phone: Joi.string().required().regex(RegExp(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)).message('not a valid no.'),
    gender: Joi.string().lowercase().required().regex(RegExp(/^(female|male)$/)).message('gender must be male or female')
})

const joivalidationput = Joi.object({
    name: Joi.string().trim().min(1).max(20), //avi
    email: Joi.string().lowercase().regex(RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)).message('not a valid email'),
   // password: Joi.string().trim().regex(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,10}$/)).message('a password must be between 3 to 10 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
    phone: Joi.string().regex(RegExp(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/)).message('not a valid no.'),
    gender: Joi.string().lowercase().regex(RegExp(/^(female|male)$/)).message('gender must be male or female')
})


const joipassword = Joi.object({

    password: Joi.string().regex(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,10}$/)).message('a password must be between 3 to 10 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),

})

const joilogin = Joi.object({
    email: Joi.string().lowercase().required().regex(RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)).message('not a valid email'),
    password: Joi.string().trim().required().regex(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,10}$/)).message('a password must be between 3 to 10 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character')

})





module.exports = { joivalidation, joivalidationput, joipassword, joilogin };

//const auth