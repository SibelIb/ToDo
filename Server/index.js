// Load the express.js file to configure the server and pass the express app object to it 
var express = require('express');
var app = express();
config = require('./config/config');        
require('./config/express')(app, config);
logger = require('./config/logger');

logger.log("Creating HTTP server on port: " + config.port);
require('http').createServer(app).listen(config.port, function () {
console.log("HTTP Server listening on port: " + config.port + ", in " + app.get('env') + " mode");
});


// Make the Express app object available to the test module so it can access the app’s api
module.exports = app;                   
