const express = require('express');
const router  = express.Router();
const User = require("../models/User");

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/profile/:id", (req, res, next) => {
  // res.render("profile/userProfile");
  User.findById(req.params.id)
  .then(user => {
    console.log(user);
    res.render(`profile/userProfile`, { user: user });
  })
  .catch(next);
});

module.exports = router;