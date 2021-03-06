require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  pwd: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["pwd"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    pwd: req.body.password
  });

  newUser.save(function(err){
    if(!err){
      res.render("secrets")
    }else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
 userName = req.body.username;
 password = req.body.password;

  User.findOne(
    {email: userName},
    function(err,foundUser){
      if(foundUser){
        if(password === foundUser.pwd){
          res.render("secrets");
        }
      }else{
        console.log(err);
      }
    }
  )
});

app.listen(3000, function(err){
  if(!err){
    console.log("Server is up and running on port 3000");
  }
});
