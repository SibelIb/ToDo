// Require modules
var express = require('express');
var app = express();                             // App object implements the server in express
var mongoose = require('mongoose');
var bluebird = require('bluebird');
logger = require('./logger');
var morgan = require ('morgan');
var glob = require ('glob');
var bodyParser = require('body-parser');
var cors = require('cors');

module.exports = function (app, config) {

app.use(cors({origin: 'http://localhost:9000'}));

// Connect to MongoDB using Mongoose
logger.log("Loading Mongoose functionality");
mongoose.Promise = require('bluebird');
mongoose.connect(config.db, {useMongoClient: true});
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

// if statement checks whether the application is running in test mode and keeps log messages from interfering with test results
if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));

 mongoose.set('debug', true);
  mongoose.connection.once('open', function callback() {
    logger.log("Mongoose connected to the database");
  });
  
app.use(function (req, res, next) {
  logger.log('Request from ' + req.connection.remoteAddress, 'info');
    next();
  });
  
// Configure body parser
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
    extended: true
  }));

// Static server
app.use(express.static(config.root + '/public'));

// Load the Models 
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
 require(model);
});

// Load the Controllers 
var controllers = glob.sync(config.root + '/app/controllers/*.js');
controllers.forEach(function (controller) {
 require(controller);
});

require('../app/controllers/users')(app, config);
require('../app/controllers/todos')(app, config);
/*app.get('/api/users', function (req, res) {
  res.status(200).json(users);
});*/


  // 404 Error Handler
    app.use(function (req, res) {
      res.type('text/plan');
      res.status(404);
      res.send('404 Not Found');
  });
  
  // 500 Error Handler 
  app.use(function (err, req, res, next) {
    console.log(err);
    if (process.env.NODE_ENV !== 'test') 
  logger.log(err.stack,'error');
    res.type('text/plan');
    if(err.status){
      res.status(err.status).send(err.message);
    } else {
      res.status(500).send('500 Sever Error');
    }
  });

// Console log "Starting Application"
  console.log("Starting application");
  }
};
