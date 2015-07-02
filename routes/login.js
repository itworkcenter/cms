var express = require('express');
var router = express.Router();
var userDao = require("../dao/UsersDao");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'SuperPort' });
});
router.post('/verify', function(req, res, next) {
  var reqObj=req.body,
      user=reqObj.user,
      pass = reqObj.pass;

  if(user && pass){

    userDao.find(function(e,d){
        res.render('login', { title: 'SuperPort',data:d });
    })

  }else{
      res.render('login', { title: 'SuperPort',data:"Null" });
  }

});

module.exports = router;
