var mongoose = require('mongoose');
var obj = {};
obj.connect = require("./connect").open();
obj.modelName = "core_user";
obj.schema = {
    Name: String,
    UserName: String,
    Pass: String,
    Age: Number,
    Height: Number,
    Weight: Number,
    Tel: Number,
    Sex: Number,
    Mail: String
};
obj.model = mongoose.model(obj.modelName, obj.schema);

obj.save = function (json, back) {
    (new this.model(json)).save(back);
};
obj.findOne = function(json,back){
    this.model.findOne(json,back);
};

module.exports = obj;