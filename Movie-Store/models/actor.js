const Joi = require('joi');
const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  Image: String
});

const Actor = mongoose.model('Actor', actorSchema);

function validateActor(actor) {
  const schema =Joi.object( {
    name: Joi.string().min(5).max(200).required()
  });

  return schema.validate(actor);
}

exports.actorSchema = actorSchema;
exports.Actor = Actor; 
exports.validate = validateActor;