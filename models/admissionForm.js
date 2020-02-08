const mongoose = require('mongoose');
const {Schema} = mongoose;

//admission form schema
const admissionSchema = new Schema({
    firstname: String,
    lastname: String,
    middlename: String,
    address: String,
    email: String,
    phoneNumber: String
});

module.exports = {Admission: mongoose.model('admission', admissionSchema)};