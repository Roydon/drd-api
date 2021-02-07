var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

 
// Thanks to http://blog.matoski.com/articles/jwt-express-node-mongoose/
 
// set up a mongoose model
var UserSchema = new Schema({
   createdTime : 
    { 
        type : Date, default: Date.now 
    },
  
    patientFirstName: {
        type: String,
       
    },
    patientMiddleName: {
        type: String,
       
    },
    patientLastName: {
        type: String,
       
    },
    token: {
        type: String,
       
    },
    patientAddress:{
        type: String,
    },
    emailId:{
        type: String,    
    },
    
    patientHealthid:{
        type: Number,
    },
    patientZipcode:{
        type: Number,
    },
    patientGender:{
        type: String,
    },
    patientDob:{
        type: String,
    },
    password: {
        type: String,
       
    },
    contactNum: {
        type: Number
    },
     officeNum: {
        type: String
    },
     homeNum: {
        type: String
    },
    deviceId: {
        type: String
    },
    
    accessLevelId: {
         type: String
        
    },
     accessLevelName : {
        type: String
    },
    
    
    employeeId:{
    type:String
                },
 add:{
           type:String                 
                },
    
    access_token:{
        type:String
    },
    emailIdRegistered:{
        type:Boolean,
        default:false
    },

    isSuperAdmin:
    {
        type:Boolean
    },
   
    isMobileVerified:
    {
        type:Boolean,
        default: false
    },
  
    isEmailVerified:
    {
        type:Boolean,
        default: false
    },
    otp: String,
    
     
     
                            
    
    
   
    
});
 
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
UserSchema.statics.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({_id : profile.id},function(err,result){ 
        if(!result){
            userObj.username = profile.displayName;
            //....
            userObj.save(cb);
        }else{
            cb(err,result);
        }
    });
};

UserSchema.index({contactNum: 1 });
UserSchema.index({contactNum: 1, patientFirstName: 1, patientDob: 1 }, {unique: true });

 
module.exports = mongoose.model('User', UserSchema);