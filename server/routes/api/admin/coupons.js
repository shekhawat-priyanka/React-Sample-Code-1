const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/auth");
const Coupon = require("../../../models/Coupon");
var response = require("../../../config/response");
const _ = require("lodash");

// @route GET api/admin/coupon
// @desc Get all coupons
// @access Public
router.get("/", auth, async (req, res, next) => {
  const {
    limit = 10,
    page = 1,
    query = "",
    orderBy = "expiry_date",
    ascending = -1
  } = req.query;

  var pageSize = await parseInt(limit);
  var order = await (ascending == "desc" ? -1 : 1);
  var sort = {};
  sort[orderBy] = order;
  const skip = pageSize * (page - 1);
  try {
    let coupon = await Coupon.aggregate([
      {
        $project: {
          coupon_code: "$coupon_code",
          consumer_type: "$consumer_type",
          discount: "$discount",
          status: "$status",
          expiry_date: "$expiry_date"
        }
      },
      {
        $match: {
          $and: [
            {
              $or: [
                { coupon_code: { $regex: query, $options: "i" } },
                { consumer_type: { $regex: query, $options: "i" } }
              ]
            }
          ]
        }
      },
      {
        $facet: {
          metadata: [
            { $count: "totalRecord" },
            { $addFields: { current_page: page, per_page: pageSize } }
          ],
          data: [
            { $sort: { [orderBy]: order } },
            { $skip: skip },
            { $limit: pageSize }
          ]
        }
      }
    ]);
    if (coupon[0].metadata.length > 0)
      return response.successResponse(res, coupon, "Coupon List.");
    else {
      coupon = [
        {
          metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
          data: []
        }
      ];
      return response.successResponse(res, coupon, "No Coupon.");
    }
  } catch (err) {
    console.error(err.message);
    return await response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/admin/coupon/add
// @desc Add a coupon
// @access Private
router.post(
  "/add",
  [
    auth,
    [
      check("coupon_code", "Coupon code is required")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .isLength({ min: 7, max: 50 })
        .withMessage("Must be 7-50 chars long"),
      check("consumer_type", "Consumer type is required")
        .not()
        .isEmpty(),
      check("discount", "Discount is required")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Invalid discount(Must be Numeric value)")
        .custom(async value => {
          if (value > 100) {
            throw new Error("discount must be less than 100%");
          }
        }),
      check("comment_text", "Comment is required")
        .not()
        .isEmpty()
        .trim()
        .escape(),
      check("expiry_date", "").custom(async value => {
        if (value !== "") {
          let current_date = new Date().getTime();
          let expiry_date = new Date(value).getTime();
          if (current_date > expiry_date) {
            throw new Error("Invalid expiry date");
          }
        }
      }),
      check("usage_limit", "Usage limit is required")
        .not()
        .isEmpty()
        .custom(async value => {
          if (value < 0) {
            throw new Error("Usage limit can not be negative");
          }
        })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }
    if (req.body.expiry_date === "")
      // if expiry date === ""
      req.body.expiry_date = "";
    else req.body.expiry_date = new Date(req.body.expiry_date).getTime();

    const {
      coupon_code,
      user_specific,
      consumer_type,
      discount,
      min_purchase,
      max_discount,
      usage_limit,
      expiry_date,
      comment_text
    } = req.body;

    try {
      let coupon = new Coupon({
        coupon_code: coupon_code,
        user_specific: user_specific,
        consumer_type: consumer_type,
        discount: discount,
        min_purchase: min_purchase,
        max_discount: max_discount,
        usage_limit: usage_limit,
        expiry_date: expiry_date,
        comment_text: comment_text
      });
      await coupon.save();
      return response.successResponse(res, coupon, "Coupon added.");
    } catch (err) {
      // console.log(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route GET api/admin/coupon/:coupon_id
// @desc Get Coupon by coupon_id
// @access Private
router.get("/:coupon_id", auth, async (req, res) => {
  try {
    let coupon = await Coupon.findOne({
      _id: req.params.coupon_id
    });
    if (!coupon)
      return response.errorResponse(
        res,
        { msg: " Coupon not found." },
        "Coupon not found.",
        400
      );

    return response.successResponse(res, coupon, "Coupon data.");
  } catch (err) {
    // console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "Coupon not found." },
        "Coupon not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
});

// @route POST api/admin/coupon/:coupon_id
// @desc Edit Coupon by coupon_id
// @access Private
router.post(
  "/:coupon_id",
  [
    auth,
    [
      check("coupon_code", "Coupon code is required")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .isLength({ min: 7, max: 50 })
        .withMessage("Must be 7-50 chars long"),
      check("consumer_type", "Consumer type is required")
        .not()
        .isEmpty(),
      check("discount", "Discount is required")
        .not()
        .isEmpty()
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Invalid discount(Must be Numeric value)")
        .custom(async value => {
          if (value > 100) {
            throw new Error("discount must be less than 100%");
          }
        }),
      check("comment_text", "Comment is required")
        .not()
        .isEmpty()
        .trim()
        .escape(),
      check("expiry_date", "").custom(async value => {
        if (value !== "") {
          let current_date = new Date().getTime();
          let expiry_date = new Date(value).getTime();
          if (current_date > expiry_date) {
            throw new Error("Invalid expiry date");
          }
        }
      }),
      check("usage_limit", "Usage limit is required")
        .not()
        .isEmpty()
        .custom(async value => {
          if (value < 0) {
            throw new Error("Usage limit can not be negative");
          }
        })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }

    if (req.body.expiry_date === "")
      // if expiry date === ""
      req.body.expiry_date = "";
    else req.body.expiry_date = new Date(req.body.expiry_date).getTime();

    const {
      coupon_code,
      user_specific,
      consumer_type,
      discount,
      min_purchase,
      max_discount,
      usage_limit,
      expiry_date,
      comment_text
    } = req.body;

    try {
      let coupon = await Coupon.findOneAndUpdate(
        { _id: req.params.coupon_id },
        {
          coupon_code: coupon_code,
          user_specific: user_specific,
          consumer_type: consumer_type,
          discount: discount,
          min_purchase: min_purchase,
          max_discount: max_discount,
          usage_limit: usage_limit,
          expiry_date: expiry_date,
          comment_text: comment_text
        }
      );

      coupon = await Coupon.findOne({
        _id: req.params.coupon_id
      });

      return response.successResponse(res, coupon, "Coupon Updated.");
    } catch (err) {
      // console.error(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route DELETE api/admin/coupon/:coupon_id
// @desc Delete Coupon by coupon_id
// @access Private
router.delete("/:coupon_id", auth, async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndRemove({
      _id: req.params.coupon_id
    });

    return response.successResponse(res, {}, "Coupon deleted.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/admin/coupon/change-status/:coupon_id
// @desc change status of Coupon by coupon_id
// @access Private
router.post(
  "/change-status/:coupon_id",
  [
    auth,
    [
      check("status", "Enter a valid status")
        .not()
        .isEmpty()
        .isIn([0, 1])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }

    const { status } = req.body;
    const couponFields = {};

    if (status) couponFields.status = status;

    try {
      let coupon = await Coupon.findOneAndUpdate(
        { _id: req.params.coupon_id },
        { $set: couponFields }
      );
      coupon = {
        _id: req.params.coupon_id,
        status: status
      };
      return response.successResponse(
        res,
        coupon,
        "Coupon status updated successfully."
      );
    } catch (err) {
      console.error(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);
module.exports = router;
