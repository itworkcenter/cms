var express = require('express');
var router = express.Router();
<<<<<<< HEAD
var submit = require("../dao/submit");
=======
var dao = require("../dao");
>>>>>>> parent of 5c0cc0b... db change to localhost

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'SuperPort' });
});
router.post('/verify', function(req, res, next) {
  var reqs=req.body;

<<<<<<< HEAD
  if(reqs.user && reqs.pass){
      submit.post({
          path:"/rest/verify",
          data:{
              user:reqs.user,
              pass:reqs.pass
          }
      },function(d){
         /* res.write(d)*/
          res.render('login', { title: 'SuperPort',data:d });
      });

  }else{
      res.render('login', { title: 'SuperPort',data:"Null" });
=======
  if(user && pass){
    console.log(dao)
>>>>>>> parent of 5c0cc0b... db change to localhost
  }
  res.render('login', { title: 'SuperPort' });
});

module.exports = router;
