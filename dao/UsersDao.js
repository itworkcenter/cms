var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/idcea');
/*mongoose.connect('mongodb://localhost/idcea');*/
/*var state = mongoose.connection.readyState;*/

module.exports=mongoose.model('core_users', { Name: String });
