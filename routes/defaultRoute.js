const express = require('express');
const router = express.Router();
const {index, admission, admissionPost} = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {Admission} = require('../models/admissionForm');
const bcrypt = require('bcryptjs');
const config = require('../config/configuration');


//Home route(go to defaultController for functionality)
router.get('/', index);

//admission form route
router.get('/admission', admission);
router.post('/admission', admissionPost);//functionality in defaultController


module.exports = router;