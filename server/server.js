//this is the browserside server
var dotenv = require('dotenv');
var test = dotenv.load();
console.log('dotenv loaded', test);
var express = require('express');
// var bodyParser = require('body-parser');

var app = express();

module.exports = app;