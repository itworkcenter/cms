var mongoose = require('mongoose');
var obj = {};
obj.connect = require("./db");
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
obj.find = function (back) {
    this.model.find(back)
};

module.exports = obj;