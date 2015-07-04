var http = require("http");
var querystring = require('querystring');
var extend = require('util')._extend;

var defaultOpts = {
    hostname: '',
    port: 3003
};
function reqs(opts,back){
    var req = http.request(opts, function (res) {
        res.setEncoding('utf8');
        if (back) {
            res.on('data', back);
        }
    });
    if (back) {
        req.on('error', back);
    }
    // write data to request body
    if (opts.data) {
        req.write(opts.data);
    }
    req.end();
}

module.exports = {
    get: function (opts,back) {
        reqs(extend(defaultOpts,opts),back);
    },
    post:function(opts,back){
        if(opts.data){
            opts.data=querystring.stringify(opts.data);
            var defaultPost = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': opts.data.length
                }
            };

            extend(defaultOpts,defaultPost);
            extend(defaultOpts,opts);

            reqs(defaultOpts,back);

        }

    }
};