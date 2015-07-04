var mongoose = require('mongoose');
var dbpath = require("./../common/config").dbstr;
module.exports = {
    open:function(){
        mongoose.connect(dbpath,{
            server: {
                auto_reconnect: true,
                poolSize: 10
            }
        },function(err){
            if(err){
                console.log('[mongoose log] Error connecting to: ' + err);
            }else{
                console.log('[mongoose log] Successfully!');
            }
        });

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'mongoose connection error:'));
        db.once('open', function callback () {
            console.log('mongoose open success');
        });
        return this;
    },
    close: function(){
        mongoose.disconnect();
        return this;
    }
}
;