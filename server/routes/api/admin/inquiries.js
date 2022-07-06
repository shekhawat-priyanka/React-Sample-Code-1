const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/auth");
const Inquiry = require("../../../models/Inquiry");
var response = require("../../../config/response");
const _ = require("lodash");

// @route GET api/admin/inquiry
// @desc Get all Inquiries
// @access Public

router.get("/", auth, async (req, res, next) => {
  const {
    limit = 10,
    page = 1,
    query = "",
    orderBy = "created_at",
    ascending = "desc"
  } = req.query;

  var pageSize = await parseInt(limit);
  var order = await (ascending == "desc" ? -1 : 1);
  if (orderBy == "name") order_by = "order_name";
  else order_by = orderBy;
  var strength = 1;
  // var sort = {};
  // sort[orderBy] = order;
  const skip = pageSize * (page - 1);
  try {
    let inquiries = await Inquiry.aggregate([
      {
        $project: {
          name: "$name",
          order_name: {
            $toLower: "$name"
          },
          email: "$email",
          phone: "$phone",
          created_at: "$created_at",
          status: "$status"
          // status: {
          //   $cond: {
          //     if: { $eq: ["$status", 0] },
          //     then: "Open",
          //     else: {
          //       $cond: {
          //         if: { $eq: ["$status", 1] },
          //         then: "Closed",
          //         else: {
          //           $cond: {
          //             if: { $eq: ["$status", 2] },
          //             then: "Sortable",
          //             else: "Actionable"
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        }
      },
      {
        $match: {
          $and: //[{ page_title: { $regex: query, $options: "i" } }]
          [
            {
              $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
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
            { $sort: { [order_by]: order } },
            { $skip: skip },
            { $limit: pageSize }
          ]
        }
      }
    ]);
    if (inquiries[0].metadata.length > 0)
      return response.successResponse(res, inquiries, "Inquiry List.");
    else {
      inquiries = [
        {
          metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
          data: []
        }
      ];
      return response.successResponse(res, inquiries, "No inquiry.");
    }
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/admin/inquiry/create
// @desc Create an inquiry
// @access Private
router.post(
  "/add",
  [
    auth,
    [
      check("Name", "Name is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
      check("email", "Enter a valid email").isEmail(),
      check("phone", "Enter a valid 10 digit number").isMobilePhone(),
      check("message", "Message is required")
        .not()
        .isEmpty()
        .isLength({ min: 20 }).withMessage('Must be at least 20 chars long')
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }

    const { Name, phone, email, message } = req.body;
    try {
      let i = await Inquiry.aggregate([
        {
          $project: {
            inquiry_ID: { $split: ["$inquiry_ID", "-"] }
          }
        },
        { $unwind: "$inquiry_ID" },
        { $match: { inquiry_ID: /[0-9]/ } },
        { $sort: { inquiry_ID: -1 } },
        { $limit: 1 }
      ]);

      if (i[0] === undefined) var x = 1;
      else var x = parseInt(i[0].inquiry_ID) + 1;
      let inquiry = new Inquiry({
        inquiry_ID: "INQ-" + x,
        email: email,
        name: Name.charAt(0).toUpperCase()+ Name.slice(1),
        phone: phone,
        message: message
      });
      await inquiry.save();
      return response.successResponse(res, inquiry, "Inquiry Created.");
    } catch (err) {
      // console.log(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route GET api/admin/inquiry/:inquiry_id
// @desc Get inquiry by inquiry_id
// @access Private
router.get("/:inquiry_id", auth, async (req, res) => {
  try {
    let inquiry = await Inquiry.findOne({ _id: req.params.inquiry_id }).select([
      "_id",
      "name",
      "phone",
      "status",
      "email",
      "message"
    ]);
    if (!inquiry)
      return response.errorResponse(
        res,
        { msg: "Inquiry not found." },
        "Inquiry not found.",
        400
      );

    return response.successResponse(res, inquiry, "Inquiry data.");
  } catch (err) {
    // console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "Inquiry not found." },
        "Inquiry not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
});

// @route POST api/admin/inquiry/:inquiry_id
// @desc Edit inquiry by inquiry_id
// @access Private
router.post(
  "/:inquiry_id",
  [
    auth,
    [
      check("Name", "Name is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
      check("email", "Enter a valid email").isEmail(),
      check("phone", "Enter a valid 10 digit number").isMobilePhone(),
      check("message", "Message is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 20 }).withMessage('must be at least 20 chars long'),
      check("email", "Enter a valid email").isEmail(),
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

    const { name, phone, email, message, status } = req.body;
    const inquiryFields = {};

    if (name) inquiryFields.name = name.charAt(0).toUpperCase()+ name.slice(1);
    if (phone) inquiryFields.phone = phone;
    if (email) inquiryFields.email = email;
    if (message) inquiryFields.message = message;
    if (status) inquiryFields.status = status;

    try {
      let inquiry = await Inquiry.findOneAndUpdate(
        { _id: req.params.inquiry_id },
        { $set: inquiryFields }
      );
      inquiry = await Inquiry.findOne({ _id: req.params.inquiry_id }).select([
        "_id",
        "name",
        "phone",
        "message",
        "email"
      ]);
      return response.successResponse(res, inquiry, "Inquiry Updated.");
    } catch (err) {
      // console.error(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route DELETE api/admin/inquiry/:enquiry_id
// @desc Delete inquiry by inquiry_id
// @access Private
router.delete("/:inquiry_id", auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findOneAndRemove({
      _id: req.params.inquiry_id
    });
    return response.successResponse(res, {}, "Inquiry deleted.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/admin/inquiry/change-status/:inquiry_id
// @desc change status of inquiry by inquiry_id
// @access Private
router.post(
  "/change-status/:inquiry_id",
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
    const inquiryFields = {};

    if (status) inquiryFields.status = status;

    try {
      let inquiry = await Inquiry.findOneAndUpdate(
        { _id: req.params.inquiry_id },
        { $set: inquiryFields }
      );
      inquiry = {
        _id: req.params.inquiry_id,
        status: status
      };
      return response.successResponse(
        res,
        inquiry,
        "Inquiry status updated successfully."
      );
    } catch (err) {
      // console.error(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);
module.exports = router;
