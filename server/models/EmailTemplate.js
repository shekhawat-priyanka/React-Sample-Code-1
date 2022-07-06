const mongoose = require("mongoose");

const EmailTemplateSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  dynamic_parameters: {
    type: String,
    required: false,
    maxlength: 500
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    min: 0,
    max: 1,
    default: 1
  },
  created_at: {
    type: Number
  },
  updated_at: {
    type: Number
  }
},
{timestamps: {  createdAt : 'created_at' , updatedAt : 'updated_at'}
});

module.exports = EmailTemplate = mongoose.model(
  "email_template",
  EmailTemplateSchema
);
