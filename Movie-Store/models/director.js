const Joi = require('joi');
const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  Image: String
});

const Director = mongoose.model('Director', directorSchema);

function validateDirector(director) {
  const schema =Joi.object( {
    name: Joi.string().min(5).max(200).required()
  });

  return schema.validate(director);
}

exports.directorSchema = directorSchema;
exports.Director = Director; 
exports.validate = validateDirector;