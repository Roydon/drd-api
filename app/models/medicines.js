var mongoose = require('mongoose');
const { Email } = require('node-ses');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var SearchSchema = new Schema({
    name:{
        type:String,
    },
    category:{
        type:String,
    },
});

var Search= module.exports = mongoose.model('medicines', SearchSchema);

module.exports.addMedicine = function(search, callback){
      console.log("logging in nowwwwww"+search);
    
	Search.create(search, callback);
};