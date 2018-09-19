const express = require("express");
const router = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const multer = require('multer');
const User = require("../models/User");

// User model
const Events = require("../models/Events");

router.get("/events/create", (req, res, next) => {
  let user = req.session.currentUser;
    // console.log('=-=-=-=-=-=-=-=-=-=--=-=-=-=-',user);
    res.render(`../views/events/create.hbs`, { user: user });
});
    
module.exports = router;