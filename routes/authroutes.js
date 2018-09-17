const express   = require("express");
const router    = express.Router();
const nodemailer = require('nodemailer');
const uploadCloud = require('../config/cloudinary.js');

// User model
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

const passport = require('passport');

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup",  uploadCloud.single('photo'), (req, res, next) => {
    const { title, description } = req.body;
    const imgPath = req.file.url;
    const imgName = req.file.originalname;
    const newUser = new User({title, description, imgPath, imgName});
    newUser.save()
    .then(user => {
      res.redirect('/');
    })
    .catch(error => {
      console.log(error);
    });
  });
  const email    = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const image    = req.body.image;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sanjoshspam@gmail.com',
      pass: 'SpamKill3r' 
    }
  });
  
  if (email === "" || username === "" || password === "") {
    req.flash('error', 'please specify a username and password to sign up');
    res.render("auth/signup", { message: req.flash("error") });
    return;
  }
  
  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: req.flash("error") });
      return;
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    User.create({
      username: username,
      password: hashPass,
      email: email,
      image: image,
    })

    .then((response)=>{
      transporter.sendMail({
        from: '"🌞OceanSideKick🌞" <SanJosh@gmail.com>',
        to: email, 
        subject: "Thanks for choosing OceanSideKick!", 
        text: `Welcome ${username} to OceanSideKick feel free to contact me sfjosh24@gmail.com if you have any questions or concerns. Enjoy, and fish away!`,
        html: `<b> Welcome ${username} to OceanSideKick feel free to contact me sfjosh24@gmail.com if you have any questions or concerns. Enjoy, and fish away! </b>`
      })
      
      
  //--------------------------------------------------
      .then(info => res.redirect('/', {email, info}, console.log(info)))
      .catch(error => console.log(error));
    })
    .catch((err)=>{
      console.log("error when signing up ---------------", err);
      res.render("auth/signup", { message: req.flash("error") });
    });
  })
  .catch(error => {
    next(error);
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

  User.findOne({ "username": username })
  .then(user => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
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