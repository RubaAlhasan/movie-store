const Joi = require('joi');

const commentSchema = {
  userName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  text:{
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000
  },
date:
{
  type: Date,
  required: true,
}
};
class Comment
{
  constructor(userName,text,date)
{
  this.userName = userName;
  this.text = text;
  this.date= date;
}

}

function validateComment(comment) {
  const schema = Joi.object({
    userName:Joi.string().required(),
    text:Joi.string().required().max(2000),
    date: Joi.required()
  });
  return schema.validate(comment);
}
exports.validateComment = validateComment;
exports.commentSchema = commentSchema;
exports.Comment = Comment;