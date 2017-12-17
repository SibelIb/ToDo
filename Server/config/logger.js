//====================================================================== Create a new log file each day ========================================================================================

var winston = require('winston');
fs = require('fs');                                     // fs module gives access to the file system

var env = process.env.NODE_ENV || 'development';        // The env variable is used to specify if in development or production mode: process.env.NODE_ENV checks for a system level environment variable called NODE_ENV
var logDir = 'log';                                     // Folder for the log files
  
var tsFormat = () => (new Date()).toLocaleTimeString();
// Create the log directory if it does not exist
      if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir);
}

var logger = new (winston.Logger)({
     transports: [                                      // Transport allows to configure the logging
     new (winston.transports.Console)({                 // The logger will log to the console, colorizing the logs based on level.
     timestamp: tsFormat,                               // Add a timestamp to the messages and provide a format for the time 
     level: env === 'development' ? 'verbose' : 'info'
}),
  
new (require('winston-daily-rotate-file'))({
      name: 'logFile',
      filename: `${logDir}/-results.log`,               // Filename of log file    
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
   })
 ]
});

log = function(message, level){
level = level || 'info';
logger.log(level, message);
};

exports.log = log;


