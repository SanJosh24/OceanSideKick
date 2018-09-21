const express = require("express");
const router = express.Router();
const uploadCloud = require('../config/cloudinary.js');
const multer = require('multer');
const User = require("../models/user");
const Events = require("../models/events");


// User model

router.get('/events/create',(req,res,next)=>{
  res.render('events/create');
});

//-=-=-=-=-=-=-=-=-=-=-=-=

router.post("/eventsCreate", (req, res, next) => {
 
  let eventName=    req.body.eventName;
  let address=      req.body.address;
  let description=  req.body.description;
  let Categories=   req.body.Categories;
  let user =          req.session.currentUser;

  console.log('this is my body=>', req.body),
  Events.create({
    eventName:     eventName,
    address:       address,
    description:   description, 
    Categories:    Categories
  })
  .then((event)=>{
    res.redirect('events/eventslist');
      // user: user
  })
  .catch((err)=>{
    next (err);
  });
});

router.get('/events/eventsList',(req, res, next) => {
  Events.find()
    .then((ret) => {
      console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-= hi',ret);
      res.render('events/eventslist', {
        listOfEvents: ret
      });
    })
    .catch(next);
  });

router.get('/events/:id', (req, res, next) => {
  Events.findById(req.params.id)
    .then((ret) => {
      res.render(`events/show`, {
        Events: ret
      });
    })
    .catch(next);
});

router.get('/events/edit/:id', (req, res, next) => {
  Events.findById(req.params.id)
    .then((ret) => {
      // console.log(ret);
      res.render('events/edit', {
        Events: ret
      });
    })
    .catch(next);
});

router.post('/events/update/:id', (req, res, next) => {
  
  const ogVariable = {
  eventName: req.body.eventName,
  description: req.body.description,
  address: req.body.address,
  Categories: req.body.Categories
  };

  Events.findByIdAndUpdate(req.params.id, ogVariable,{
    })
    .then(() => {
      res.redirect('/events/eventsList');
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

router.post('/events/:id/delete', (req, res, next) => {
  Events.findByIdAndRemove(req.params.id)
    .then((ret) => {
      res.redirect('/events/eventsList');
    })
    .catch(next);
});
  
    
module.exports = router;