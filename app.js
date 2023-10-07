const express = require('express');
const app = express();
require('dotenv').config();
const sequelize = require('./util/sequelize')

//import and middlewares
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(bodyParser.json());

//use static files 
app.use(express.static(path.join(__dirname, "views")));

//import models and database
const User = require ('./models/user-model');

//import routes
const userRouter = require('./routes/user');



//route directs
app.use('/', userRouter);

app.use((req, res)=>{
    res.sendFile(path.join(__dirname,`/views/${req.url}`));
})


sequelize.sync()
.then(result=>{
    app.listen(3000, ()=>{
            console.log("Server running");
    })
}) 
.catch((err)=>{
    console.log("Database Error setting Sequelize",err);
})


















