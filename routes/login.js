var express = require('express');
var router = express.Router();
var dao = require("../dao");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'SuperPort' });
});
router.post('/verify', function(req, res, next) {
  var reqObj=req.body,
      user=reqObj.user,
      pass = reqObj.pass;

  if(user && pass){
    console.log(dao)
  }
  res.render('login', { title: 'SuperPort' });
});

module.exports = router;
