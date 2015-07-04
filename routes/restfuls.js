var express = require('express');
var router = express.Router();
var User = require("../dao/UsersDao");
/* GET home page. */
router.route('/verify/user').post(function (req, res) {

    var reqs = req.body;

    User.findOne(
        {
            UserName: reqs.user,
            Pass: reqs.pass
        }, function (e, d) {
            if (d) {
                res.send("success");
            } else {
                res.send();
            }
        });
});

module.exports = router;
