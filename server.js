require('dotenv').config()
console.log(process.env.DB_URL);
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var morgan = require('morgan');
var mongoose = require('mongoose');
var methodOverride = require('method-override')
var cors = require('cors');
var config = require('./config/database'); // get db config file

var path = require('path');
var port = process.env.PORT || 80;
var Doctor = require('./app/models/doctor');
var Patient = require('./app/models/patient');
var Clinic = require('./app/models/clinic');
var Case = require('./app/models/case');
var Slot = require('./app/models/slot');
var Appointment = require('./app/models/appointment');
var Prescription = require('./app/models/prescription');
var Feedback = require('./app/models/feedback');
var Search = require('./app/models/search');
var randomstring = require("randomstring");
var randomNumber = require('random-number');
var nodemailer = require('nodemailer');
const axios = require('axios');
var moment = require('moment');
var User = require('./app/models/user');
app.use(cors());



//insta credential

//multer

var multer = require('multer');






var moment = require('moment');









function getNextSequence(name, fn) {
    var retseq = 0;

    Id.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { new: true }, function (err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
        }


        retseq = doc.seq;

        fn(retseq);

    });

}




Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var isEmpty = function (obj) {


    if (obj == null) return true;


    if (obj.length > 0) return false;
    if (obj.length === 0) return true;


    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('dev'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Authorization, Accept");
    next();
});

const PORT = 5000;

// const dbURI = 'mongodb://root:zxcv1990@localhost:27017/doctor?authSource=admin';
// const dbURI = 'mongodb://root:aRNs9qf6mFsk@https://staging.doctorsday.app/doctorsday?authSource=admin';
const dbURI = process.env.DB_URL;
// const dbURI = 'mongodb://localhost/main10store';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then((result) => {
        app.listen(PORT, async () => {
            console.log("Application Started in Port " + PORT)

            
            let d = await Doctor.findOne({emailId: "roydon.pereira@gmail.com", password: "password123"});
            if(!d) {

                var randomstring2 = require("randomstring");

            var doctorData = {
                doctorId: randomstring2.generate(8),
                doctorName: "roydon pereira",
                doctorMobile: "9876543210",
                emailId: "roydon.pereira@gmail.com",
                doctorAddress: "some address",
                doctorSpeciality: "primary",
                doctorExperience: "1",
                password: "password123"
        
            }
            Doctor.addDoctor(doctorData, function (err, doctorData) {
                console.log(err)

                console.log(doctorData._id.toString);


                var clinicData = {
                    clinicId: randomstring2.generate(8),
                    clinicName: "clinic1",
                    clinicAddress: "clinic1 adress",
                    doctorId: doctorData._id.toString(),
                    doctorName: "roydon",
                    doctorMobile: 9876543210
                }
            
                Clinic.addClinic(clinicData)

                    var clinicData2 = {
                        clinicId: randomstring2.generate(8),
                        clinicName: "clinic2",
                        clinicAddress: "clinic2 adress",
                        doctorId: doctorData._id.toString(),
                        doctorName: "roydon",
                        doctorMobile: 9876543210
                    }
                
                    Clinic.addClinic(clinicData2);


            });
        }


        })
    })
    .catch((err) => console.log(err));


// mongoose.connect(config.database);
// mongoose.connect("mongodb://root:EmyVfyP9pFZB@localhost/exp?authSource=admin", {useNewUrlParser: true});
// pass passport for configuration

route = require('./routes/routes');
var apiRoutes = express.Router();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/assets/images'));
app.use(express.static('uploads'));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public', 'index.html'));

});

// connect the api routes under /api/*
app.use('/api', apiRoutes);


Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

apiRoutes.get('/users/', function (req, res) {


    User.find(function (err, user) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.json(err);
        }

        else {
            res.json({ success: true, users: user }); // return all todos in JSON format
        }

    });


});


apiRoutes.post('/addSearchTerm', function (req, res, next) {
    var search = req.body;
    var searchData = {
        searchTerm: search.searchTerm,
        category: search.category
    }
    Search.addSearch(searchData, function (err, searchData) {
        if (err) {
            res.json({ success: false, msg: 'Failed to add Request' });
        }
        else {
            res.json({ success: true, msg: 'Search Added Successfully', data: searchData });
        }
    });
});


// get search term

apiRoutes.post('/getSearchTerm', function (req, res) {
    Search.find({}, function (err, searchData) {
        if (err) {
            res.json({ success: false, msg: 'Unable To Fetch Searchterm', res: err });
        } else {
            res.json({ success: true, msg: 'Searchterm Request Sent Successfully', data: searchData });
        }
    });

});

//add doctor api

apiRoutes.post('/addDoctor', function (req, res) {
    var token = getToken(req.headers);
    var userId = req.body.userId;
    var doctor = req.body;
    console.log(doctor)
    var password = req.body.password;
    var randomstring2 = require("randomstring");
    var doctorData = {
        doctorId: randomstring2.generate(8),
        doctorName: doctor.doctorName,
        doctorMobile: doctor.doctorMobile,
        emailId: doctor.emailId || doctor.doctorEmailId,
        doctorAddress: doctor.doctorAddress,
        doctorSpeciality: doctor.doctorSpeciality,
        doctorExperience: doctor.doctorExperience,
        password: password

    }
    Doctor.addDoctor(doctorData, function (err, doctorData) {
        if (err) {
            console.log(err);
            res.json({ success: false, msg: 'Failed to add Request' });
        }
        else {
            console.log(doctorData);
            res.json({ success: true, msg: 'Doctor Added Successfully', data: doctorData });
        }
    });
});


apiRoutes.post('/getDoctor', function (req, res) {
    var contactNum = req.body.contactNum;
    if (contactNum != undefined) {
        Doctor.findOne({ 'doctorMobile': contactNum }, function (err, doctor) {
            if (doctor) {
                res.json({ success: true, msg: 'Doctor Request Sent Successfully', data: doctor });
            }
            else {
                res.json({ success: false, msg: 'Unable To Fetch Doctor', res: err });
            }

        });
    } else {
        res.json({ success: false, msg: 'No doctor with this Contact Number exist' });
    }
});


//Add Feedback


apiRoutes.post('/addFeedback', function (req, res) {
    var userId = req.body.userId;
    var userName = req.body.userName;
    var doctorEmail = req.body.doctorEmail;
    var feedbackValue = req.body.feedbackValue;
    var feedback = req.body;
    console.log(feedback);
    if (userId != undefined) {
        var feedbackData = {
            'userId': userId,
            'userName': userName,
            'feedbackValue': feedbackValue
        }
        Feedback.addFeedback(feedbackData, function (err, feedback) {
            if (err) {
                res.json({ success: false, msg: 'Failed to add Request' });
            }
            else {

                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'your email address',
                        pass: 'password'
                    }
                });

                console.log('created');
                var mailOptions = {
                    from: 'your email address',
                    to: 'your email address',
                    subject: 'Feedback from ' + userName,
                    text: feedbackValue
                }

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({ success: true, msg: 'Feedback Sent.' })
                    }
                });

            }
        });
    } else {
        res.json({ success: false, msg: 'No Userid found' });
    }
});




// get doctor for patient api

apiRoutes.post('/getDoc', function (req, res) {
    Doctor.find({}, function (err, doctor) {
        if (err) {
            res.json({ success: false, msg: 'Unable To Fetch Doctor', res: err });
        } else {
            res.json({ success: true, msg: 'Doctor Request Sent Successfully', data: doctor });
        }
    });
});



//update doctor api

apiRoutes.post('/updateDoctorProfile', function (req, res) {
    var doctorId = req.body.doctorId;
    var doctorName = req.body.doctorName;
    var doctorAddress = req.body.doctorAddress;
    var doctorMobile = req.body.doctorMobile;
    var doctorAdhaarNumber = req.body.doctorAdhaarNumber;
    var doctorPincode = req.body.doctorPincode;
    var doctorGender = req.body.doctorGender
    if (doctorId) {
        Doctor.update({ '_id': doctorId }, {
            $set: {
                "doctorName": doctorName,
                "doctorAddress": doctorAddress,
                "doctorMobile": doctorMobile,
                "doctorAdhaarNumber": doctorAdhaarNumber,
                "doctorPincode": doctorPincode,
                "doctorGender": doctorGender,
            }
        }, function (err, numberAffected, rawResponse) {
            if (err) {
                res.json({ success: false, msg: 'Doctor Failed To Update' });
                throw err;
            }
            else {

                Doctor.findOne({ '_id': doctorId }, function (err, doctor) {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to Update' });
                    } else {
                        res.json({ success: true, msg: 'Doctor Updated Successfully', data: doctor });
                    }
                })

            }
        });

    }
    else {
        res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
    }
});

//update patient api

apiRoutes.post('/updatePatientProfile', function (req, res) {

    var patientZipcode = req.body.patientZipcode;
    if (patientZipcode != undefined && patientZipcode != null) {
        var userId = req.body.userId;
        var patientFirstName = req.body.patientFirstName;
        var patientLastName = req.body.patientLastName;
        var patientMiddleName = req.body.patientMiddleName;
        var patientAddress = req.body.patientAddress;
        var patientEmailId = req.body.patientEmailId;
        var patientGender = req.body.patientGender;
        var patientDob = req.body.patientDob;
        if (true) {
            User.update({ '_id': userId }, {
                $set: {
                    "patientFirstName": patientFirstName,
                    "patientLastName": patientLastName,
                    "patientMiddleName": patientMiddleName,
                    "patientAddress": patientAddress,
                    "emailId": patientEmailId,
                    "emailIdRegistered": true,
                    "patientZipcode": patientZipcode,
                    "patientGender": patientGender,
                    "patientDob": patientDob,
                    "contactNum": req.body.contactNum
                }
            }, { upsert : true },  function (err, numberAffected, rawResponse) {
                if (err) {
                    res.json({ success: false, msg: 'Patient Failed To Update' });
                    throw err;
                }
                else {

                    User.findOne({ "contactNum": req.body.contactNum }, function (err, user) {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to Update' });
                        } else {
                            res.json({ success: true, msg: 'Patient Updated Successfully', data: user });
                        }
                    })


                }
            });

        }
        else {
            res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
        }
    } else {
        var userId = req.body.userId;
        var patientName = req.body.patientName;
        var patientDob = req.body.patientDob;
        if (true) {
            User.update({ '_id': userId }, {
                $set: {
                    "patientName": patientName,
                    "patientDob": patientDob,
                    "contactNum": req.body.contactNum
                }
            }, { upsert : true },   function (err, numberAffected, rawResponse) {
                if (err) {
                    res.json({ success: false, msg: 'Patient Failed To Update' });
                    throw err;
                }
                else {

                    User.findOne({ "contactNum": req.body.contactNum }, function (err, user) {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to Update' });
                        } else {
                            res.json({ success: true, msg: 'Patient Updated Successfully', data: user });
                        }
                    })


                }
            });

        }
        else {
            res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
        }
    }

});

apiRoutes.post('/verify-sms', async function(req, res) {
    req.body.contactNum = req.body.contactNum.toString().replace("+91", "");
    var otp = parseInt(req.body.otp);

    const query = { "contactNum": req.body.contactNum, otp };
    console.log(query);

   

    User.findOne(query, function (err, user) {


        console.log(user)

       

            if (user) {
                User.update({ "contactNum": req.body.contactNum }, {
                    $set: {
                        isMobileVerified : true
                    }
                }, { multi: true},  function (err, numberAffected, rawResponse) {
            
                    
                });
                
                res.json({ success: true, msg: 'Valid OTP', data: user });
            }
            else {
                res.json({ success: false, msg: 'Invalid OTP', res: err });
            }
        
    });


});

apiRoutes.post('/resend-sms', async function(req, res) {
    req.body.contactNum = req.body.contactNum.toString().replace("+91", "");

    var otp = Math.floor(100000 * Math.random() + 900000);
    console.log(otp);

    const accountSid = '';
    const authToken = '';
    const client = require('twilio')(accountSid, authToken);
    const country_code = "+91";

    
    let to_send = req.body.contactNum.toString();
    if(to_send.indexOf(country_code) >= 0){}
    else {to_send = country_code + to_send  }

    const sms_bofy = {
        body: 'Your 6 digit code for app is - ' + otp,
        from: '+17744625692',
        to: to_send
    };

    console.log(sms_bofy);

    client.messages.create(sms_bofy).then(message => console.log(message.sid));

    User.update({ "contactNum": req.body.contactNum }, {
        $set: {
            otp:otp
        }
    }, { multi: true},  function (err, numberAffected, rawResponse) {

        res.json({ success: true });
        
    });


})

// get patient api

apiRoutes.post('/getPatient', function (req, res) {
    var contactNum = req.body.contactNum;
    if (contactNum != undefined) {
        User.findOne({ 'contactNum': contactNum }, function (err, user) {
            
            console.log(user)

            if (user) {
                res.json({ success: true, msg: 'Patient Request Sent Successfully', data: user });
            }
            else {
                res.json({ success: false, msg: 'Unable To Fetch Patient', res: err });
            }

        });
    } else {
        res.json({ success: false, msg: 'No User with this Contact Number exist' });
    }
});


// appointment api

apiRoutes.post('/bookAppointment', function (req, res, next) {

    var appointment = req.body;
    var userId = appointment.patienId;
    var slotArray = JSON.parse(appointment.slotArray);

    User.findOne({ '_id': userId }, function (err, user) {
        if (err) {

        } else {


            Slot.findOneAndUpdate({ 'clinicId': appointment.clinicId, 'date': appointment.appointmentDate }, {
                $set: {
                    "slotTimings": slotArray

                }
            }, function (err, numberAffected, rawResponse, clinicData) {
                if (err) {

                } else {
                    var randomstring2 = require("randomstring");
                    var appointmentData = {

                        appointmentId: randomstring2.generate(5),
                        appointmentDate: appointment.appointmentDate,
                        clinicId: appointment.clinicId,
                        clinicName: appointment.clinicName,
                        clinicAddress: appointment.clinicAddress,
                        doctorId: appointment.doctorId,
                        doctorName: appointment.doctorName,
                        doctorMobile: appointment.doctorMobile,
                        patientId: appointment.patientId,
                        patientFirstName: appointment.patientFirstName,
                        patientMiddleName: appointment.patientMiddleName,
                        patientLastName: appointment.patientLastName,
                        patientMobile: appointment.patientMobile,
                        appointmentStartTime: appointment.appointmentStartTime,
                        appointmentEndTime: appointment.appointmentEndTime,
                        isOnlineAppointment: appointment.isOnlineAppointment
                    };


                    Appointment.addAppointment(appointmentData, function (err, appointmentData) {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to add Request' });
                        }
                        else {
                            var allAppointment = [];
                            for (var i = 0; i <= appointmentData.length; i++) {
                                var date = appointmentData[i].appointmentDate;
                                var appDate = moment(date).format("DD-MM-YYYY");
                                appointmentData[i].appStyleDate = appDate;
                                allAppointment.push(appointmentData[i]);
                            }
                            res.json({ success: true, msg: 'Appointment Booked Successfully', data: appointmentData });

                            // var userFcm = slotDetails.userFcm;
                            // axios
                            // .post('https://fcm.googleapis.com/fcm/send', {
                            //   "notification":{
                            //     "title":"Appointment Booked",
                            //     "body":appointment.patientName +" has booked appointment for "+appointment.appointmentDate,
                            //     "sound":"default",
                            //     "click_action":"FCM_PLUGIN_ACTIVITY",
                            //     "icon":"fcm_push_icon"
                            //   },
                            //   "data":{

                            //     "status":txStatus
                            //   },
                            //     "to":doctorFcm,
                            //     "priority":"high",
                            //     "restricted_package_name":""
                            // },
                            // {
                            //   headers: {
                            //    'Content-Type':'application/json',
                            //     'Authorization': 'key=AAAAc4oA-Sk:APA91bEHL3E1p_e9DS62Y2bdIbtVlguJS7Kp-ge897NEgtlP3zouO1mMdpnacS1RQ7Q8krlMtdYah2zK_gqqWkYAeMC6utpXkaYAR-y_k5ghJ8laOAKYzyTG6NAESq1bTeFfFABTnYBb' 
                            //   }
                            // })
                            // .then(res => {
                            //   console.log(`statusCode: ${res.statusCode}`)
                            //   console.log(res)
                            // })
                            // .catch(error => {
                            //   console.error(error)
                            // })

                        }
                    });
                }
            })
        }
    })
    // }
    // })


});


// update and book appintment api

apiRoutes.post('/newUserAppointment', function (req, res, next) {

    var appointment = req.body;
    var userId = appointment.patienId;
    var slotArray = [];
    var slotArray = JSON.parse(appointment.slotArray);;
    User.findOne({ '_id': userId }, function (err, user) {
        if (err) {
            res.json({ success: false, msg: 'No User exist' });
        } else {

            User.findOneAndUpdate({ '._id': userId }, {
                $set: {
                    "patientFirstName": appointment.patientFirstName,
                    "patientMiddleName": appointment.patientMiddleName,
                    "patientLastName": appointment.patientLastName,
                    "patientDob": appointment.patientDob

                }
            }, function (err, numberAffected, rawResponse, userData) {
                if (err) {
                    res.json({ success: false, msg: 'Failed to Update User' });

                } else {
                    Slot.findOneAndUpdate({ 'clinicId': appointment.clinicId, 'date': appointment.appointmentDate }, {
                        $set: {
                            "slotTimings": slotArray

                        }
                    }, function (err, numberAffected, rawResponse, clinicData) {
                        if (err) {

                        } else {
                            var randomstring2 = require("randomstring");
                            var appointmentData = {
                                appointmentId: randomstring2.generate(5),
                                appointmentDate: appointment.appointmentDate,
                                clinicId: appointment.clinicId,
                                clinicName: appointment.clinicName,
                                clinicAddress: appointment.clinicAddress,
                                doctorId: appointment.doctorId,
                                doctorName: appointment.doctorName,
                                doctorMobile: appointment.doctorMobile,
                                patientId: appointment.patientId,
                                patientFirstName: appointment.patientFirstName,
                                patientMiddleName: appointment.patientMiddleName,
                                patientLastName: appointment.patientLastName,
                                patientMobile: appointment.patientMobile,
                                appointmentStartTime: appointment.appointmentStartTime,
                                appointmentEndTime: appointment.appointmentEndTime,
                                isOnlineAppointment: appointment.isOnlineAppointment
                            };
                            Appointment.addAppointment(appointmentData, function (err, appointmentData) {
                                if (err) {
                                    res.json({ success: false, msg: 'Failed to add Request' });
                                }
                                else {
                                    var allAppointment = [];
                                    for (var i = 0; i <= appointmentData.length; i++) {
                                        var date = appointmentData[i].appointmentDate;
                                        var appDate = moment(date).format("DD-MM-YYYY");
                                        appointmentData[i].appStyleDate = appDate;
                                        allAppointment.push(appointmentData[i]);
                                    }
                                    res.json({ success: true, msg: 'Appointment Booked Successfully', data: appointmentData });
                                }
                            });
                        }
                    })
                }
            });

        }
    })
});



// create slot api

apiRoutes.post('/createSlot', function (req, res, next) {
    var slotArr = JSON.parse(req.body.slotDetails);
    var docterId = req.body.docterId;
    var slotArrLength = slotArr.length;
    for (var i = 0; i < slotArr.length; i++) {
        if (i == slotArr.length - 1) {
            var clinicId = slotArr[i].clinicId;
            var date = slotArr[i].date;
            var day = slotArr[i].day;
            var slotTimings = slotArr[i].slotTimings;
            var slotData = {
                doctorId: docterId,
                clinicId: clinicId,
                date: date,
                day: day,
                slotTimings: slotTimings
            };
            Slot.addSlot(slotData, function (err, slotData) {
                if (err) {
                    res.json({ success: false, data: err });
                }
                else {
                    res.json({ success: true, data: slotData });
                }
            });
        } else {
            var clinicId = slotArr[i].clinicId;
            var date = slotArr[i].date;
            var day = slotArr[i].day;
            var slotTimings = slotArr[i].slotTimings;
            var slotData = {
                doctorId: docterId,
                clinicId: clinicId,
                date: date,
                day: day,
                slotTimings: slotTimings
            };

            Slot.addSlot(slotData, function (err, slotData) {
                if (err) {
                    res.json({ success: false, data: err });
                }
                else {
                    if (i == slotArr.length - 1) {
                        res.json({ success: true, data: slotData });
                    }
                }
            });
        }

    }

});

// get slot api

apiRoutes.post('/getSlot', function (req, res) {
    var clinicId = req.body.clinicId;
    var slotDate = req.body.slotDate;

    if (clinicId) {
        Slot.findOne({ 'clinicId': clinicId, 'date': slotDate }, function (err, slot) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: true, data: slot });
            }
        });
    }
    else {
        res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
    }
});

apiRoutes.post('/getBookedSlots', function (req, res) {
    var clinicId = req.body.clinicId;
    var slotDate = req.body.dates;

    console.log(slotDate);

    if (clinicId) {
        Appointment.find({ 'clinicId': clinicId, 'appointmentDate': { $in : slotDate } }, function (err, slot) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: true, data: slot });
            }
        });
    }
    else {
        res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
    }
});

apiRoutes.post('/getPatients', function (req, res) {

    User.find({}, function (err, slot) {
        if (err) {
            console.log(err);
        } else {
            res.json({ success: true, data: slot });
        }
    });
    
});

apiRoutes.post('/addPatients', async function (req, res) {

    console.log(req.body);

    if(req.body.dob){
        req.body.dob = moment(new Date(req.body.dob)).format('DD/MM/YYYY');
    }

    console.log(req.body);

    // var userId = req.body.userId;
    var patientFirstName = req.body.firstName;
    var patientLastName = req.body.lastName;
    var patientMiddleName = '';
    var patientAddress = '';
    var patientEmailId = '';
    var patientGender = 'Male';
    var patientDob = req.body.dob;
    var patientZipcode = '';

    req.body.contactNum = req.body.contactNum.replace("+91", "");


    let existing = await User.findOne({ "contactNum": req.body.contactNum , "patientFirstName": patientFirstName, "patientDob": patientDob })
    if(existing) {
        res.json({ success: false, msg: "Patient already exist with these details , Try search with name , dob or mobile no" });
        return;
    } 

    var otp = Math.floor(100000 * Math.random() + 900000);
    console.log(otp);



    const accountSid = '';
    const authToken = '';
    const client = require('twilio')(accountSid, authToken);
    const country_code = "+91";

    
    let to_send = req.body.contactNum.toString();
    if(to_send.indexOf(country_code) >= 0){}
    else {to_send = country_code + to_send  }

    const sms_bofy = {
        body: 'Your 6 digit code for app is - ' + otp,
        from: '+17744625692',
        to: to_send
    };

    console.log(sms_bofy);


    client.messages.create(sms_bofy).then(message => console.log(message.sid));


    User.update({ "contactNum": req.body.contactNum, "patientFirstName": patientFirstName, "patientDob": patientDob }, {
        $set: {
            "patientFirstName": patientFirstName,
            "patientLastName": patientLastName,
            "patientMiddleName": patientMiddleName,
            "patientAddress": patientAddress,
            "emailId": patientEmailId,
            "emailIdRegistered": false,
            "patientZipcode": patientZipcode,
            "patientGender": patientGender,
            "patientDob": patientDob,
            "contactNum": req.body.contactNum,
            otp:otp
        }
    }, { upsert : true },  function (err, numberAffected, rawResponse) {


        User.update({ "contactNum": req.body.contactNum }, {
            $set: {
                otp:otp
            }
        }, { multi: true},  function (err, numberAffected, rawResponse) {
    
            
        });

        User.find({  }, function (err, slot) {
            if (err) {
                console.log(err);
            } else {


                res.json({ success: true, data: slot });


            }
        });
    });

    
    
});


// Cancel Appointment api

apiRoutes.post('/cancelAppointment', function (req, res) {
    var appointmentId = req.body.appointmentId;
    var patientId = req.body.patientId;
    var doctorName = req.body.doctorName;
    var appointmentDate = req.body.appointmentDate;
    var slotId = req.body.slotId;
    var slotArray = JSON.parse(req.body.slotArray);

    if (slotId) {
        Slot.findOneAndUpdate({ '_id': slotId }, {
            $set: {
                "slotTimings": slotArray

            }
        }, function (err, numberAffected, rawResponse, slotData) {
            if (err) {
                res.json({ success: false, msg: 'Slot Failed To Update' });

            }
            else {
                if (appointmentId) {
                    Appointment.update({ '_id': appointmentId }, {
                        $set: {
                            "isCancelled": true

                        }
                    }, function (err, numberAffected, rawResponse, appointmentData) {
                        if (err) {

                            res.json({ success: false, msg: 'Appointment Failed To Update' });
                            throw err;
                        }
                        else {
                            //                                             axios
                            // .post('https://fcm.googleapis.com/fcm/send', {
                            //   "notification":{
                            //     "title":"Appointment Cancelled",
                            //     "body":'Dr '+doctorName +" has cancelled appointment for "+appointmentDate,
                            //     "sound":"default",
                            //     "click_action":"FCM_PLUGIN_ACTIVITY",
                            //     "icon":"fcm_push_icon"
                            //   },
                            //   "data":{

                            //     "status":txStatus
                            //   },
                            //     "to":patientFcm,
                            //     "priority":"high",
                            //     "restricted_package_name":""
                            // },
                            // {
                            //   headers: {
                            //    'Content-Type':'application/json',
                            //     'Authorization': 'key=AAAAFtFf7TE:APA91bHdrJFrB9tKEtSAzo2XbDAzBTWXDS-HRca1xlxAHWW1wim7a_f_LY3SPS6PlRKHN1BdVvxFhqOxT5zUCSNZ1j51V4JXWfFEH8NkbjtRy0IwWWfYEVm9GwCFYppYrJxpViMn070h' 
                            //   }
                            // })
                            // .then(res => {
                            //   console.log(`statusCode: ${res.statusCode}`)
                            //   console.log(res)
                            // })
                            // .catch(error => {
                            //   console.error(error)
                            // })
                            res.json({ success: true, msg: 'Appointment Updated Successfully', data: appointmentData, slotData: slotData });
                        }
                    });




                }
                else {
                    res.json({ success: false, msg: 'No appointment Id' });
                }

            }
        });
    } else {
        res.json({ success: false, msg: 'No slot id' });
    }

    // }
    // })

});

// get all Doctor appointment

apiRoutes.post('/getAllDoctorAppointment', function (req, res) {

    var doctorId = req.body.doctorId;
    if (doctorId) {
        Appointment.find({ doctorId: doctorId }, function (err, appointment) {
            if (err) {
                res.json({ success: false, msg: 'Unable to fetch appointment' });
            } else {
                res.json({ success: true, data: appointment });
            }

        });
    }
    else {
        res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
    }
});

// get all Patient appointment

apiRoutes.post('/getAllPatientAppointment', function (req, res) {

    var patientId = req.body.patientId;
    if (patientId) {
        Appointment.find({ patientId: patientId }, function (err, appointment) {
            if (err) {
                res.json({ success: false, msg: 'Unable to fetch appointment' });
            } else {
                res.json({ success: true, data: appointment });
            }

        });
    }
    else {
        res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
    }
});


// clinic api

apiRoutes.post('/addClinic', function (req, res, next) {
    var doctorId = req.body.doctorId;
    var clinic = req.body;
    var randomstring2 = require("randomstring");
    var clinicData = {
        clinicId: randomstring2.generate(8),
        clinicName: clinic.clinicName,
        clinicAddress: clinic.clinicAddress,
        doctorId: clinic.doctorId,
        doctorName: clinic.doctorName,
        doctorMobile: clinic.doctorMobile
    }

    Clinic.addClinic(clinicData, function (err, clinic) {
        if (err) {
            res.json({ success: false, msg: 'Failed to add Request' });
        }
        else {
            res.json({ success: true, msg: 'Clinic Added Successfully', data: clinic });
        }
    });
});

//Get Slots
apiRoutes.post('/getClinicSlot', function (req, res, next) {

    var clinicId = req.body.clinicId;
    var isDoctor = req.body.isDoctor;
    if (isDoctor) {
        var doctorId = req.body.doctorId;
        console.log(doctorId);
        Doctor.findOne({ '_id': doctorId }, function (err, doctor) {
            if (err) {
                res.json({ success: false, msg: 'User Not Authorized' });
            } else {
                Clinic.findOne({ _id: clinicId }, function (err, clinic) {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to Fetch Clinic Request' });

                    }
                    else {
                        res.json({ success: true, msg: 'Clinic Fetched Successfully', data: clinic });
                    }
                });
            }
        })
    } else {
        var userId = req.body.userId;
        User.findOne({ '_id': userId }, function (err, user) {
            if (err) {
                res.json({ success: false, msg: 'User Not Authorized' });
            } else {
                Clinic.findOne({ _id: clinicId }, function (err, clinic) {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to Fetch Clinic Request' });


                    }
                    else {


                        res.json({ success: false, msg: 'Clinic Fetched Successfully', data: clinic });

                    }
                });
            }
        })
    }








});

apiRoutes.post('/addSlots', function (req, res, next) {
    var doctorId = req.body.doctorId;
    var clinicId = req.body.clinicId;
    var clinicDetails = req.body;
    var newSlot = clinicDetails.slotDetails
    var slot = JSON.parse(newSlot);
    Doctor.findOne({ '_id': doctorId }, function (err, doctor) {
        if (err) {
            res.json({ success: false, msg: 'Invalid User Id' });
        } else {
            Clinic.findOne({ '_id': clinicId }, function (err, clinic) {
                if (err) {
                    res.json({ success: false, msg: 'Invalid Clinic Id' });
                } else {
                    var slotArray = [];

                    var slotArray = clinic.slots;
                    slot.forEach(element => {
                        slotArray.push(element);
                    });
                    Clinic.update({ '_id': clinicId }, {
                        $set: {
                            'slots': slotArray,
                        }
                    }, function (err, numberAffected, rawResponse) {
                        if (err) {
                            res.json({ success: false, msg: 'Unable to update' });
                        } else {
                            Clinic.findOne({ '_id': clinicId }, function (err, clinic) {
                                if (err) {
                                    res.json({ success: false, msg: 'Invalid Clinic Id' });
                                } else {
                                    res.json({ success: true, msg: 'Slot Updated', data: clinic });
                                }

                            })
                        }
                    })
                }
            })

        }
    });
});
// get all clinic

apiRoutes.post('/getAllClinic', function (req, res) {

    var doctorId = req.body.doctorId;
    if (doctorId) {
        Clinic.find({ 'doctorId': doctorId }, function (err, clinic) {
            if (err) {
                res.json({ success: false, msg: 'Unable to fetch Clinic' });
            } else {
                res.json({ success: true, data: clinic });
            }
        });
    }
    else {
        res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
    }
});

// cases api

apiRoutes.post('/addCase', function (req, res, next) {
    var cases = req.body;
    var caseData = {
        appointmentDate: cases.appointmentDate,
        clinicName: cases.clinicName,
        patientName: cases.patientName,
        patientMobile: cases.patientMobile,
        doctorName: cases.doctorName,
        doctorMobile: cases.doctorMobile,
        caseStatus: cases.caseStatus,
        caseSubject: cases.caseSubject
    }
    Case.addCase(caseData, function (err, caseData) {
        if (err) {
            res.json({ success: false, msg: 'Failed to add Request' });
        }
        else {
            res.json({ success: true, msg: 'Case Added Successfully', data: caseData });
        }
    });
});

//prescription api

apiRoutes.post('/addPrescription', function (req, res, next) {

    var patientId = req.body.patientId;
    var prescription = req.body;
    var medicines = JSON.parse(prescription.prescriptionData);
    var randomstring2 = require("randomstring");
    var prescriptionData = {
        prescriptionId: randomstring2.generate(6),
        patientId: patientId,
        symptoms: prescription.symptoms,
        remark: prescription.remark,
        prescriptionData: medicines,
        appointmentDate: prescription.appointmentDate,
        patientFirstName: prescription.patientFirstName,
        patientMiddleName: prescription.patientMiddleName,
        patientLastName: prescription.patientLastName,
        patientAge: prescription.patientAge,
        patientHeight: prescription.patientHeight,
        patientWeight: prescription.patientWeight,
        patientBp: prescription.patientBp,
        patientPulse: prescription.patientPulse,
        patientMobile: prescription.patientMobile,
        doctorName: prescription.doctorName,
        doctorMobile: prescription.doctorMobile,
        doctorId: prescription.doctorId,
    }
    Doctor.findOne({ '_id': prescription.doctorId }, function (err, doctor) {
        if (err) {
            res.json({ success: false, msg: 'TokenAuth Failed' });
        } else {
            Prescription.addPrescription(prescriptionData, function (err, prescriptionData) {
                if (err) {
                    res.json({ success: false, msg: 'Failed to add Request' });
                }
                else {
                    res.json({ success: true, msg: 'Prescription Added Successfully', data: prescriptionData });
                }
            });

        }
    });


});

// update prescription

apiRoutes.post('/updatePrescription', function (req, res) {
    var prescription = req.body;
    var doctorId = req.body.doctorId;
    var remark = req.body.remark;
    var medicines = JSON.parse(prescription.prescriptionData);
    if (doctorId) {
        Prescription.update({ doctorId: doctorId }, {
            $set: {
                "prescriptionData": medicines,
                "remark": remark,


            }
        }, function (err, numberAffected, rawResponse) {
            if (err) {
                res.json({ success: false, msg: 'Prescription Failed To Update' });
                throw err;
            }
            else {
                res.json({ success: true, msg: 'Prescription Updated Successfully' });
            }
        });

    }
    else {
        res.json({ success: false, msg: 'Unable to fetch Token Authentication failed' });
    }
});


//Get prescription Patient

apiRoutes.post('/getPrescription', function (req, res, next) {
    var isDoctor = req.body.isDoctor;
    if (isDoctor) {
        var doctorId = req.body.doctorId;
        Doctor.find({ '_id': doctorId }, function (err, doctor) {
            if (err) {
                res.json({ success: false, msg: 'TokenAuth Failed' });
            } else {
                Prescription.find({ 'doctorId': doctorId }, function (err, prescriptionData) {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to add Request' });
                    }
                    else {
                        res.json({ success: true, msg: 'Prescription Fetched Successfully', data: prescriptionData });
                    }
                });
            }
        })
    } else {

        var userId = req.body.userId;
        var contactNum = req.body.contactNum;
        console.log(userId);
        console.log(contactNum);
        User.findOne({ 'contactNum': contactNum }, function (err, user) {
            console.log(user);
            console.log('Hey this is User');
            if (err) {
                res.json({ success: false, msg: 'TokenAuth Failed' });
            } else {
                Prescription.find({ 'patientMobile': contactNum }, function (err, prescriptionData) {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to add Request' });
                        //	throw err;
                    }
                    else {
                        res.json({ success: true, msg: 'Prescription Fetched Successfully', data: prescriptionData });
                    }
                });

            }
        });
    }


});

apiRoutes.post('/signupUser', route.signupUser);
apiRoutes.post('/signupDoctor', route.signupDoctor);
apiRoutes.post('/loginDoctor', route.loginDoctor);
// Start the server
// app.listen(port);

// console.log('Server is running at  http://localhost:' + port);        

