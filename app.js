//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const encryption = require('mongoose-encryption');


mongoose.connect('mongodb://localhost:27017/secretsDb', {useUnifiedTopology:true, useNewUrlParser: true});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));



//user schema

const credSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        
    }
);

credSchema.plugin(encryption,{secret: process.env.SECRET, encryptedFields: ["password"]});

//

const secretsSchema = new mongoose.Schema(
    {
        secret: String
    }
)

//models

const credModel =  mongoose.model('cred', credSchema);

const secretModel = mongoose.model('secret', secretsSchema);




app.get("/", function(req, res)
{
    res.render("home");
})


app.get("/login", function(req, res)
{
    res.render("login");
})

app.get("/register", function(req, res)
{
    res.render("register");
})


app.post("/register", function(req, res)
{
   const newUser = new credModel({
       email: req.body.username,
       password:   req.body.password
   });

   newUser.save(function(err)
   {
       if(!err)
       {
           res.render("secrets");
       }
   })
})



app.get("/logout", function(req, res)
{
   res.render("home");
})


app.get("/submit", function(req, res)
{
   res.render("submit");
})


app.post("/submit", function(req, res)
{
    
    const userSecret = new secretModel({
        secret: req.body.secret
    })

    userSecret.save();

    res.render("secrets");

})


app.post("/login", function(req, res)
{
   
   const userLoggingIn = req.body.username;
   const password = req.body.password;

   credModel.findOne({email:req.body.username},function(err, userIdentified)
   {
       if(!err)
       {
           if(userIdentified.email === userLoggingIn && userIdentified.password === password)
           {
             res.render("secrets");
           }

           else{
               res.render("home");
           }
       }
   })

})



app.listen(3000, function()
{
    console.log('application server started and running at 3000');
})