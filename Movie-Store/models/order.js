
const Joi = require('joi');
const { join } = require('lodash');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  movieId: {
    type:mongoose.ObjectId,
   ref:"Movie"
  },
  userId: {
    type:mongoose.ObjectId,
    ref:"User"
  },
  price:{
      type:Number,
      required:true
  },
  date: {
type:Date,
required:true
  },
  email:{
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique:false
  },
  creditNumber:{
    type:Number,
    required:true,
  }
});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
 const schema =Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    movieId:Joi.objectId().required(),
    userId:Joi.objectId().required(),
    price: Joi.number().required(),
    date:Joi.required(), 
   
    creditNumber:Joi.number().required(),   
  });
  return schema.validate(order);
}

exports.orderSchema = orderSchema;
exports.Order = Order; 
exports.validate = validateOrder;