const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Order, validate} = require('../models/order');
const {Movie} = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const { User } = require('../models/user');

const router = express.Router();
router.use(
  express.urlencoded({
    extended: true
  })
);
router.use(express.json());

router.get('/get/:movieId',[auth,admin], async (req, res) => {
  const Orders = await Order.find(movieId = req.params.movieId).sort('date');
  res.send(Orders);
});

router.post('/add/:movieId', [auth], async (req, res) => {

const movie =await Movie.findById(req.params.movieId).select({price:1});
if (!movie) return res.status(400).send('Invalid movie.'); 

const orderobj ={
  movieId:req.params.movieId,
  userId:req.user._id,
  date:Date(),
  email:req.body.email,
  creditNumber:req.body.creditNumber,
  price:movie.price
};

const { error } = validate(orderobj); 
if (error) return res.status(400).send(error.details[0].message);

let order =new Order (orderobj);
  order = await order.save();
 var movieobj={movieId:req.params.movieId};
  const user = await User.findByIdAndUpdate(req.user._id,
    { $push: { movies: movieobj } }, { new: true });
    
   res.send(order);
});



module.exports = router;