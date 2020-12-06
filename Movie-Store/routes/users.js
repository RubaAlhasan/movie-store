const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const {Movie} = require('../models/movie'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.use(
  express.urlencoded({
    extended: true
  })
);
router.use(express.json());

router.post('/register', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password','gender']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
 //user.isAdmin = true;
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email','isAdmin']));
});


router.get("/GetUserMovies",[auth],async (req,res) =>{ 
  var id = req.user._id;
  const userMovies = await User.findById(id)
  .select({movies:1});
res.send(userMovies);
  });

  router.get("/GetUserRate/:movieId",[auth],async (req,res) =>{ 
    if(!req.params.movieId) res.status(400).send('Invalid movie.');
    var userId = req.user._id;
    const movie = await Movie
    .findOne({'_id':req.params.movieId.trim(),'rates':{$elemMatch:{user: userId}}})
    .select({'rates':1});
   let rate = 0;
   if( movie != null )
   movie.rates.forEach(element => {
  
    if (element.user == userId)
    {
     rate = element.value ;
     console.log(element);
     return;
    }
    });
  res.send(rate.toString());
    });

module.exports = router; 
