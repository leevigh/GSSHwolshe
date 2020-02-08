const mailer = require('../misc/mailer');
//admission form model
const {Admission} = require('../models/admissionForm');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


module.exports = {
    index: (req, res) => {
        res.render('index');
    },
    admission: (req, res) => {
        res.render('admissionForm');
    },
    admissionPost: (req, res) => {
        //Do admission form post, payment of the form
        //and let it send the details to the admin
    }
}
