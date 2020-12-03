const express = require('express');
const genres = require('../routes/genres');
const directors = require('../routes/directors');
const actors = require('../routes/actors');
const movies = require('../routes/movies');
const orders = require('../routes/orders');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const fileUpload = require('express-fileupload');
module.exports = function(app) {
  app.use('/api/genres', genres);
  app.use('/api/directors', directors);
  app.use('/api/actors', actors);
  app.use('/api/movies', movies);
  app.use('/api/orders', orders);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error); 
  app.use(fileUpload({
    createParentPath: true
  }));
  app.use(
    express.urlencoded({
      extended: true
    })
  );
  
  app.use(express.json());
}