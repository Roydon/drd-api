var mongo = require('mongodb');
var User   = require('../app/models/user');

var Doctor = require('../app/models/doctor');
var jwt         = require('jwt-simple');
var config      = require('../config/database'); 

var randomstring = require("randomstring");
const PASSWORD_SALT = process.env.PASSWORD_SALT;

var redis_client = require('../redis').client;

var ses = require('node-ses')
  , client = ses.createClient({ key: 'AKIAIU3WW5LJIXFEPR6Q', secret: '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' });


//new changes abhi

exports.signupUser = function(req, res) {
  console.log(req.body);
  var num =req.body.contactNum;
  User.findOne({'contactNum':num}, function(err, user) {
  console.log("this should be user obj"+user);
  if(user){
  var deviceId = req.body.deviceId;
  User.update({'_id':user._id} , { $set: {deviceId:deviceId}}, function (err, userUpdate) {
  console.log("goes here");
  console.log(deviceId);
  console.log("updated device id above");
  res.json({success: true, msg: 'User Exists.',user:user});
  });
  }else if(user===null){
  console.log("GOES IN ELSE");
  var user=req.body;
  user.accessLevelName="basic";
  if (req.body.clientId=="general")
  {
  user.accessLevelName="basic";
  }
  if (!(req.body.clientId==null || req.body.clientId==""))
  {
  user.clientName=req.body.clientId.clientName;
  }
  if(req.body.password==null || req.body.password=="")
  {
  user.password=randomstring.generate(5);
  }
  var newUser =new User(user);
  newUser.save(function(err,obj) {
  if (err) {
  console.log(err);
  return res.json({success: false, msg: "User Name Already Exists"});
  }
  else {
  var token = jwt.encode(obj, config.secret);
  res.json({success: true, token: 'JWT ' + token,msg: 'Successful created new user.',user:obj});
  var transid= new Id({_id:"transactions"+obj._id,seq:0,userId:obj._id});
  transid.save(function(err,obj)
  {
  if (err) 
  {
  console.log(err);
  }
  console.log("Created ID");
  });

  }
  });

  }
  });
 
  };


  exports.signupDoctor = function(req, res) {
    console.log(req.body);
    console.log(typeof(req.body));
    console.log(JSON.stringify("Hey"+req.body));
    if (!req.body.emailId &&!req.body.password) {
    res.json({success: false, msg: 'Please Enter Email'});
    
    }
    else{
    var emailId =req.body.emailId; 
    var password=req.body.password;
    Doctor.findOne({'emailId':emailId,'password':password}, function(err, doctor) {
    console.log("this should be doctor obj"+doctor);
    if(doctor){
    var deviceId = req.body.deviceId;
    Doctor.update({'_id':doctor._id} , { $set: {deviceId:deviceId}}, function (err, doctorUpdate) {
    console.log("goes here");
    console.log(deviceId);
    console.log("updated device id above");
    res.json({success: true, msg: 'User Exists.',doctor:doctor});
    });
    }else if(doctor===null){

      res.json({success: false, msg: 'No doctor Exists.'});
  
    }
    
    });
  }
    };
  

//end


// login doctor

exports.loginDoctor = function(req, res)  {
  var password=req.body.password;
  var emailId=req.body.emailId;
  if(emailId!=undefined){
    Doctor.findOne({emailId: emailId}, function(err, doctor) {
    if (err) {
      res.json({success: false, msg: 'Please check parameters.'});
    
    } else {
      if(doctor && password==doctor.password){
        var jwt = require('jsonwebtoken');
        var objD = { type: 'DOCTOR', emailId }
        var token = jwt.sign(objD, PASSWORD_SALT);
        redis_client.set(token, JSON.stringify(objD));
        res.json({success: true, msg: 'successfully logged in',doctor:doctor, token });
      } else {
        res.json({success: false, msg: 'Invalid username and password',doctor:doctor});
      }
    }
  });
      }
    else{
        res.json({success: false, msg: 'Parameters Missing.'});
        
    }
};


exports.memberinfo = function(token,userId) {
 // var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);

      if(decoded._id==userId){
          return true;
      }
      else
          return false;
 

};
};
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
