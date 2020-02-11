const express = require("express");
const router = express.Router();
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { Pay } = require('../models/pay')
const { initializePayment, verifyPayment } = require('../config/paystack')(request);







module.exports = router;


