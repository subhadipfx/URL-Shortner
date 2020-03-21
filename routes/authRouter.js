const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/signup',passport.authenticate('signupStrategy',{
  successRedirect: '/user/profile',
  failureRedirect:'/signup',
failureFlash: true
}));

router.post('/signin',passport.authenticate('signinStrategy',{
  // successRedirect: '/user/profile',
  failureRedirect: '/',
  failureFlash: true
}),(req,res,next)=>{
  // console.log('hey',req.user);
  res.redirect('/user/profile');
  // next();
});

module.exports = router;
