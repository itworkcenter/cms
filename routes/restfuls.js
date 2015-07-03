var express = require('express');
var router = express.Router();
var User = require("../dao/UsersDao");
/* GET home page. */
router.post('/varify/', function (req, res, next) {
    console.log(req)

    /*User.find(function (e, d) {
        var rslt = d[0];
        if (rslt.UserName == reqs.user && rslt.Pass == reqs.pass) {
            res.write("ok");
        } else {
            res.write("no");
        }
    });*/

    res.write("no");
});

module.exports = router;
