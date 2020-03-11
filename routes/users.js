const express = require('express');
const router = express.Router();
const User = require('../src/Model/User');
const passport = require('passport');
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('./user/profile');
  }else{
    res.redirect('/');
  }
});

router.post('/signup',async (req,res) => {
  try {
    const dbobj = {
      firstName : req.body.firstName,
      lastName :  req.body.lastName,
      email : req.body.email,
      password : req.body.password,
      seq : 1
    };
    const user = new User(dbobj);
    await user.save();
    console.table(user);
    res.status(201).send({user})
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

router.post('/signin',passport.authenticate('local',{
  successRedirect: '/user',
  failureRedirect: '/',
  failureFlash: true
}));

module.exports = router;
