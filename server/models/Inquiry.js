const mongoose = require("mongoose"); ////

const InquirySchema = new mongoose.Schema({
  inquiry_ID: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    maxlength: 10
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
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

module.exports = Inquiry = mongoose.model("inquiry", InquirySchema);
