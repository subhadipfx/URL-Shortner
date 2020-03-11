var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated){
    res.render('index', { title: 'Fx-URL' ,user:'AgentFx'});
  }else{
    res.render('index', { title: 'Fx-URL' });
  }
});

module.exports = router;
