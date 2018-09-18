const express = require('express');
const router  = express.Router();

router.get("/profile/:id", (req, res, next) => {
  res.render("/profile/userProfile");
});





module.exports = router;