const winston = require('winston');
const mongoose = require('mongoose');
var logger = require('./logging.js');
// module.exports = function() {
 // mongoose.connect('mongodb://localhost/MovieStore')
  //  .then(() => winston.info('Connected to MongoDB...'));
//} 

module.exports = function() {
  mongoose.connect('mongodb://localhost/MovieStore',
  {useNewUrlParser: true, useUnifiedTopology:true,useCreateIndex:true,
  useFindAndModify:false})
    .then(() => winston.info('Connected to MongoDB...'));
}