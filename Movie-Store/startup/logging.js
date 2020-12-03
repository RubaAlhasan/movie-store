const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.handleExceptions(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
 winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: 'logfile.log' ,
            level: 'info'
        })
    ]
});
 winston.createLogger({
    transports: [
        new winston.transports.MongoDB({
          db: 'mongodb://localhost/MovieStore',
            level: 'info'
        })
    ]
});
}
