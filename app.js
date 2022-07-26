//jshint esversion:6

require('dotenv').config();  //it is imp to put this at the top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env. API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//for setup of new userDB we need to create a schema
// const userSchema = {
//   email: String,
//   password: String
// };

//for mongoose encryption metod we need toupdate our schema structure as below
const userSchema = new mongoose.Schema( {
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] }); //it is imp to add this plugin before mongoose.model

//now we can use our user schema to setup a new user Model
const User =  new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("Home");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("Register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else{
      if (foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});



app.listen(3000, function(){
  console.log("Server started on port 3000");
});
