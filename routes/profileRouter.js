const express = require('express');
const router = express.Router();
const User = require('../src/Model/User');
const URLData = require('../src/Model/URLData');
router.use((req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
});

router.get('/', async function(req, res, next) {
    const urls = await URLData.find({user_id:req.user._id});
    // console.log(urls);
    res.render('./user/profile',{name: req.user.firstName, title : 'Profile',urls:urls});
});

router.get('/signout',(req,res) => {
    req.logout();
    res.redirect('/');
});

module.exports =router;