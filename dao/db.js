var mongoose = require('mongoose');
var dbpath=require("./config").dbstr;
module.exports=mongoose.connect(dbpath);