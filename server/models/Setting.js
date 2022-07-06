const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      maxlength: 150
      },

      value: {
      type: String,
      maxlength: 1000
      },

      is_to_be_displayed: {
      type: Boolean,
      required: true,
      default: false
      },

    created_at: {
      type: Number
    },
    updated_at: {
      type: Number
    }
  },
  {timestamps: {  createdAt : 'created_at' , updatedAt : 'updated_at'}
  }
)

module.exports = Setting = mongoose.model('setting', SettingSchema);
