const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

const CouponSchema = new Schema({
	coupon_code: {
		type: String,
		required: true,
		maxlength: 50
	},
	user_specific: {
        type: String
    },
    discount: {
        type: Number,
        required: true
    },
    min_purchase: {
        type: Number,
        default: 0
    },
    max_discount: {
        type: Number,
        default: 0
    },
    usage_limit: {
        type: Number,
        required: true
    },
    expiry_date: {
        type: Number
    },
    comment_text: {
        type: String,
        required: true
    },
	consumer_type: {
        type: Number,
        required: true,
		min: 1,
		max: 3,
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
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Coupon = mongoose.model("coupon", CouponSchema);