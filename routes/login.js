var express = require('express');
var router = express.Router();
var utils = require("../dao/utils");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'SuperPort' ,data:"Null" });
});
router.post('/verify', function(req, res, next) {
  var reqs=req.body;

  if(reqs.user && reqs.pass){
      utils.request({
          port:3003,
          path:"/rest/varify",
          method:"post"
      },{
          user:reqs.user,
          pass:reqs.pass
      },function(d){
          res.render('login', { title: 'SuperPort',data:d });
      });

  }else{
      res.render('login', { title: 'SuperPort',data:"Null" });
  }

});

module.exports = router;
