var express = require('express');
var router = express.Router();
var submit = require("../dao/submit");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'SuperPort' ,data:"Null" });
});
router.post('/verify', function(req, res, next) {
  var reqs=req.body;

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
  }

});

module.exports = router;
