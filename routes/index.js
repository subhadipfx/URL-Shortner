var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    console.log(req.isAuthenticated());
    res.redirect('/user/profile');
  }else{
    res.render('index', { title: 'Fx-URL' });
  }
});

module.exports = router;
