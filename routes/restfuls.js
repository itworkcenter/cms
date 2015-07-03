var express = require('express');
var router = express.Router();
var User = require("../dao/UsersDao");
/* GET home page. */
router.post('/verify/user', function (req, res, next) {

    var reqs = req.body;

    User.find(function (e, d) {
        var rslt = d[0];
        if (rslt.UserName == reqs.user && rslt.Pass == reqs.pass) {
            res.send("success");
        } else {
            res.send();
        }
    });
});

module.exports = router;
