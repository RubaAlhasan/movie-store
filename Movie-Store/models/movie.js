const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');
const {actorSchema} = require('./actor');
const {directorSchema} = require('./director');
const {commentSchema} = require('./comment');
const { number, required, string } = require('joi');

const Movie = mongoose.model('Movies', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  description: {
    type: String,
    maxlength: 2000
  },
  Image: String,
  genre: { 
    type: genreSchema,  
    required: true
  },
  actors: [actorSchema],  
  director: directorSchema,  
  price: { 
    type: Number, 
    min: 0
  },
  comments:[commentSchema],
  rates:[{
     user:{
       type:mongoose.ObjectId,
       ref:"User"
     },
     value:{
       type:Number,
       required:true
     }
   }]
}));

function validateMovie(movie) {
  const schema =Joi.object( {
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId(),
    directorId: Joi.objectId(),
    actors:Joi.required(),
    price: Joi.number().min(0).required(),
    description:Joi.string().max(2000)
  });
  return schema.validate(movie);
}

exports.Movie = Movie; 
exports.validate = validateMovie;