const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const uploadCloud = require('../config/cloudinary.js');
const multer = require('multer');

// User model
const User = require("../models/user");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

const passport = require('passport');

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup",
  uploadCloud.single('photo'),
  (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    var imgName;
    var imgPath;
    console.log("====================================== ", req.file)
    if(req.file === undefined) {
      imgPath = "../images/blank-profile-picture.png";
      imgName = "no profile pic";
    } else {
      imgPath = req.file.url;
      imgName = req.file.originalname;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    // console.log(req.file.originalname);
    const newUser = new User({
      email,
      username,
      password: hashPass,
      imgName,
      imgPath
    });
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sanjoshspam@gmail.com',
        pass: 'SpamKill3r'
      }
    });
    
    if (email === "" || username === "" || password === "") {
      req.flash('error', 'please specify a username and password to sign up');
      res.render("auth/signup", {
        message: req.flash("error")
      });
      return;
    }
    
    User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          message: req.flash("error")
        });
        return;
      }
    });
    newUser.save()
      .then(response => {
        transporter.sendMail({
          from: '"🌞OceanSideKick🌞" <SanJosh@gmail.com>',
          to: email,
          subject: "Thanks for choosing OceanSideKick!",
          text: `Welcome ${username} to OceanSideKick feel free to contact me sfjosh24@gmail.com if you have any questions or concerns. Enjoy, and fish away!`,
          html: `<b> Welcome ${username} to OceanSideKick feel free to contact me sfjosh24@gmail.com if you have any questions or concerns. Enjoy, and fish away! </b>`
        })
            //--------------------------------------------------
            .then(info => res.redirect('/', {
              email,
              info
            }, console.log(info)))
            .catch(error => console.log(error));
            res.redirect(`/profile/${response._id}`);
        })
        .catch((err) => {
          console.log("error when signing up ---------------", err);
          res.render("auth/signup", {
            message: req.flash("error")
          });
        });
    });
        
    router.get("/login", (req, res, next) => {
      res.render("../views/auth/login.hbs");
    });
    
    router.post("/login", (req, res, next) => {
      const username = req.body.username;
      const password = req.body.password;
    
      if (username === "" || password === "") {
        res.render("auth/login", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }
    
      User.findOne({
          "username": username
        })
        .then(user => {
          if (!user) {
            res.render("auth/login", {
              errorMessage: "The username doesn't exist"
            });
            return;
          }
          if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.redirect(`/profile/${user._id}`);
          } else {
            res.render("auth/login", {
              errorMessage: "Incorrect password"
            });
          }
        })
        .catch(error => {
          next(error);
        });
    });
    
module.exports = router;