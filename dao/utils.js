var http = require("http");
var querystring = require('querystring');
module.exports = {
    request: function () {
        /*arguments:opts,postData,back*/
        var args = arguments,
            opts = args[0],
            postData = args[1],
            back = args[args.length - 1];

        var req = http.request(opts, function (res) {
            /*console.log('STATUS: ' + res.statusCode);
             console.log('HEADERS: ' + JSON.stringify(res.headers));*/
            res.setEncoding('utf8');
            if (typeof back == "function") {
                res.on('data', back);
            }
        });

        if (typeof back == "function") {
            req.on('error', back);
        }
        // write data to request body
        if (postData && typeof postData != "function") {
            req.write(querystring.stringify(postData));
        }
console.log(querystring.stringify(postData))
        req.end();
    }
};