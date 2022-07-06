const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  blog_title: {
    type: String,
    required: true,
    maxlength: 100
  },
  blog_header: {
    type: String,
    required: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  meta_description: {
    type: String
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

module.exports = Blog = mongoose.model("blog", BlogSchema);
