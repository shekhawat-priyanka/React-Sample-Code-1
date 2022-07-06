const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/auth");
const EmailTemplate = require("../../../models/EmailTemplate");
var response = require("../../../config/response");

// @route GET api/admin/emailTemplate
// @desc Get all email templates
// @access Public
router.get("/", auth, async (req, res, next) => {
  const {
    limit = 10,
    page = 1,
    query = "",
    orderBy = "created_at",
    ascending = -1
  } = req.query;

  var pageSize = await parseInt(limit);
  var order = await (ascending == "desc" ? -1 : 1);
  var sort = {};
  sort[orderBy] = order;
  const skip = pageSize * (page - 1);
  try {
    let emailTemplate = await EmailTemplate.aggregate([
      {
        $project: {
          title: "$slug".charAt(0).toUpperCase() + "$slug".slice(1),
          created_at: "$created_at",
          status: "$status"
          // status: {
          //   $cond: {
          //     if: { $eq: ["$status", 0] },
          //     then: "Inactive",
          //     else: "Active"
          //   }
          // }
        }
      },
      {
        $match: {
          $and: [{ title: { $regex: query, $options: "i" } }]
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
    if (emailTemplate[0].metadata.length > 0)
      return response.successResponse(
        res,
        emailTemplate,
        "Email Template List."
      );
    else {
      emailTemplate = [
        {
          metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
          data: []
        }
      ];
      return response.successResponse(res, emailTemplate, "No Email Template.");
    }
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/admin/emailTemplate/create
// @desc Create an email template
// @access Private
router.post(
  "/create",
  [
    auth,
    [
      check("subject", "Subject is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
      check("slug", "Slug is required.")
        .not()
        .isEmpty(),
        // .custom(value => {
        //   return EmailTemplate.findOne({ slug: value }).then(emailTemplate => {
        //     if (emailTemplate) {
        //       throw new Error("Slug already exist.");
        //     }
        //   });
        // }),
      check("description", "Email body is required.")
        .not()
        .isEmpty().trim()
        .isLength({ min: 20 }).withMessage('must be at least 20 chars long')
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }

    const { subject, slug, dynamic_parameters, description } = req.body;

    try {
      let eTemplate = await EmailTemplate.findOne({ slug: slug })

      if (eTemplate) {
      let e = await EmailTemplate.aggregate([
        {
          $project: {
            slug: { $split: ["$slug", "-"] },
          }
        },
        { $unwind: "$slug" },
        { $match: { slug: /[0-9]/} },
        { $sort: { slug: -1 } },
        { $limit: 1 }
      ]);

       if (e[0] === undefined) var x = 1;
       else var x = parseInt(e[0].slug) + 1;
      
        var emailTemplate = new EmailTemplate({
         subject : subject.charAt(0).toUpperCase()+ subject.slice(1),
         slug : slug + ( '-' + x ),
         dynamic_parameters,
         description
       });
      }else{
        var emailTemplate = new EmailTemplate({
          subject : subject.charAt(0).toUpperCase()+ subject.slice(1),
          slug,
          dynamic_parameters,
          description
        });
      }
     var y = await emailTemplate.save();
//console.log(y)
      return response.successResponse(
        res,
        emailTemplate,
        "Email Template Created."
      );
    } catch (err) {
      // console.log(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route GET api/admin/emailTemplate/:emailTemplate_id
// @desc Get Email Template by emailTemplate_id
// @access Private
router.get("/:emailTemplate_id", auth, async (req, res) => {
  try {
    let emailTemplate = await EmailTemplate.findOne({
      _id: req.params.emailTemplate_id
    }).select([
      "_id",
      "subject",
      "slug",
      "dynamic_parameters",
      "description",
      "status"
    ]);
    if (!emailTemplate)
      return response.errorResponse(
        res,
        { msg: "Email Template not found." },
        "Email Template not found.",
        400
      );

    return response.successResponse(res, emailTemplate, "Email Template data.");
  } catch (err) {
    // console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "Email Template not found." },
        "Email Template not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
});

// @route POST api/admin/emailTemplate_id/:emailTemplate_id
// @desc Edit Email Template emailTemplate_id
// @access Private
router.post(
  "/:emailTemplate_id",
  [
    auth,
    [
      check("subject", "Subject is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
      check("description", "Email body is required.")
        .not()
        .isEmpty().trim()
        .isLength({ min: 20 }).withMessage('must be at least 20 chars long')
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }
    const { subject, dynamic_parameters, description } = req.body;
    const emailTemplateFields = {};

    if (subject) emailTemplateFields.subject = subject;
    if (dynamic_parameters)
      emailTemplateFields.dynamic_parameters = dynamic_parameters;
    else emailTemplateFields.dynamic_parameters = "";
    if (description) emailTemplateFields.description = description;

    try {
      let emailTemplate = await EmailTemplate.findOneAndUpdate(
        { _id: req.params.emailTemplate_id },
        { $set: emailTemplateFields }
      );
      emailTemplate = await EmailTemplate.findOne({
        _id: req.params.emailTemplate_id
      }).select(["_id", "subject", "dynamic_parameters", "description"]);
      return response.successResponse(
        res,
        emailTemplate,
        "Email Template Updated."
      );
    } catch (err) {
      // console.error(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route DELETE api/admin/emailTemplate/:emailTemplate_id
// @desc Delete Email Template by emailTemplate_id
// @access Private
router.delete("/:emailTemplate_id", auth, async (req, res) => {
  try {
    const emailTemplate = await EmailTemplate.findOneAndRemove({
      _id: req.params.emailTemplate_id
    });
    return response.successResponse(res, {}, "Email Template deleted.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/admin/emailTemplate/change-status/:emailTemplate_id
// @desc change status of email Template by emailTemplate_id
// @access Private
router.post(
  "/change-status/:emailTemplate_id",
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
    const emailTemplateFields = {};
    emailTemplateFields.status = status;

    try {
      let emailTemplate = await EmailTemplate.findOneAndUpdate(
        { _id: req.params.emailTemplate_id },
        { $set: emailTemplateFields }
      );

      emailTemplate = {
        _id: req.params.emailTemplate_id,
        status: status
      };
      return response.successResponse(
        res,
        emailTemplate,
        "Email template status updated successfully."
      );
    } catch (err) {
      // console.error(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);
module.exports = router;
