const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      maxlength: 25,
    },
    last_name: {
      type: String,
      required: false,
      maxlength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      min: 0,
      max: 3,
      default: 2,
    },
    last_login: {
      type: Number,
    },
    role: [
      {
        user_type: {
          type: Number,
          min: 1,
          max: 3,
          default: 2,
        },
      },
    ],
    created_at: {
      type: Number,
    },
    updated_at: {
      type: Number,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var User = mongoose.model("user", UserSchema);

module.exports = {
  User: User,
};
