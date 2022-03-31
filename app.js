const express = require('express');
const app = express();
require('dotenv').config();
require('./db');
///////////////////////////////////////////////
//const mongoose = require('mongoose');
//const connect = mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
///*
//connect.then(
//    (dbx) => {
//        console.log("DB -> Connected");
//    },
//    (err) => {
//        console.log("DB Error -> " + err);
//    }
//);  */

//mongoose.connection.on('connected', function () {
//    console.log('database is connected successfully');
//});
//mongoose.connection.on('disconnected', function () {
//    console.log('database is disconnected successfully');
//})
//mongoose.connection.on('error', console.error.bind(console, 'connection error:'));                                                                            // ,err=>{console.log('connection failed');}

//module.exports = mongoose.connection;

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: false }))                                                                                                                             // frontend ke data ko receive in json form and then save
app.use(bodyparser.json());



const controllerRoute = require('./api/routers/routes');
//const studentRoute = require('./api/controllers/faculty');
app.use('/', controllerRoute);
//app.use('/faculty', studentRoute);

app.use((req, res, next) => { res.status(404).json({ error: 'url not exist' }) });


//app.use((req, res, next) => { res.status(200).json({ message: 'app is running' }) })




app.listen(3000, console.log("app is running"));
 
module.exports = app;