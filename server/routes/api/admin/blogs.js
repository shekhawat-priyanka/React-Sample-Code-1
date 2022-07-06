const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/auth");
const Blog = require("../../../models/Blog");
var response = require("../../../config/response");
const mongoose = require("mongoose");
const fs = require('fs');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/uploads/blog",
  filename: function (req, file, cb) {
    cb(null, "Blog-" + Date.now() + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
});

// @route GET api/admin/blog
// @desc Get all blogs
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
    let blog = await Blog.aggregate([
      {
        $project: {
          blog_title: "$blog_title",
          blog_header: "$blog_header",
          created_at: "$created_at",
          status: "$status"
        }
      },
      {
        $match: {
          $and: [
            {
              $or: [
                { blog_title: { $regex: query, $options: "i" } },
                { blog_header: { $regex: query, $options: "i" } }
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
    if (blog[0].metadata.length > 0)
      return response.successResponse(res, blog, "Blog List.");
    else {
      blog = [
        {
          metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
          data: []
        }
      ];
      return response.successResponse(res, blog, "No Blog.");
    }
  } catch (err) {
    console.error(err.message);
    return await response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/admin/blog/create
// @desc Create a blog
// @access Private
router.post(
  "/create",
  [
    auth,
    upload.single("file"),
    [
      check("blog_title", "Blog Title is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
      check("blog_header", "Blog Header is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
      check("slug", "Slug is required.")
        .not()
        .isEmpty(),
      check("description", "Description is required.")
        .not()
        .isEmpty().trim()
        .isLength({ min: 20 }).withMessage('must be at least 20 chars long'),
      check("image", "Thumbnail is required")
        .not()
        .isEmpty()
      //   .custom((value,{req}) => {
      //     if ( (req.file !== undefined) && (1000000 < req.file.size)) {
      //       throw new Error("Thumbnail too large.");
      //     } else {
      //         return value;
      //     }
      // })
    ]
  ],
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }

    var imageName = req.file.filename;

    // if(req.file.size > 1000000){
    //  // console.log("Thumbnail too large.");
    //   return response.errorResponse(res, {}, "Thumbnail too large.", 500);
    // }

    const {
      blog_title,
      blog_header,
      slug,
      description,
      meta_description
    } = req.body;

    try {

      let blogSlug = await Blog.findOne({ slug: slug })
       //############## slug !== null #################
      if (blogSlug) {
        let b = await Blog.aggregate([
          {
            $project: {
              slug: { $split: ["$slug", "-"] },
            }
          },
          { $unwind: "$slug" },
          { $match: { slug: /[0-9]/ } },
          { $sort: { slug: -1 } },
          { $limit: 1 }
        ]);

        if (b[0] === undefined) var slugCount = 1;
        else var slugCount = parseInt(b[0].slug) + 1;

        var blog = new Blog({
          slug: slug + ('-' + slugCount),
          blog_title: blog_title.charAt(0).toUpperCase() + blog_title.slice(1),
          blog_header: blog_header.charAt(0).toUpperCase() + blog_header.slice(1),
          description,
          meta_description,
          thumbnail: imageName
        });
      } else {          //################  slug === null #################

        var blog = new Blog({
          blog_title: blog_title.charAt(0).toUpperCase() + blog_title.slice(1),
          blog_header: blog_header.charAt(0).toUpperCase() + blog_header.slice(1),
          slug,
          description,
          meta_description,
          thumbnail: imageName
        });
      }
      var blogSave = await blog.save();

      return response.successResponse(res, blog, "Blog Created.");
    } catch (err) {
      // console.log(err.message);
      fs.unlinkSync("./public/uploads/blog/" + req.file.filename);       // delete image if error
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route GET api/admin/blog/:blog_id
// @desc Get Blog by blog_id
// @access Private
router.get("/:blog_id", auth, async (req, res) => {
  try {
    let blog = await Blog.findOne({
      _id: req.params.blog_id
    }).select([
      "_id",
      "blog_title",
      "blog_header",
      "slug",
      "description",
      "meta_description",
      "status",
      "thumbnail"
    ]);
    if (!blog)
      return response.errorResponse(
        res,
        { msg: " Blog not found." },
        "Blog not found.",
        400
      );

    return response.successResponse(res, blog, "Blog data.");
  } catch (err) {
    // console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "Blog not found." },
        "Blog not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
});

// @route POST api/admin/blog/:blog_id
// @desc Edit Blog by blog_id
// @access Private
router.post(
  "/:blog_id",
  [
    auth,
    upload.single("file"),
    [
      check("blog_title", "Blog Title is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
      check("blog_header", "Blog Header is required")
        .not()
        .isEmpty().trim().escape()
        .isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
      check("description", "Description is required.")
        .not()
        .isEmpty().trim()
        .isLength({ min: 20 }).withMessage('must be at least 20 chars long'),
      check("image", "Thumbnail is required.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }

    const {
        blog_title,
        blog_header,
        meta_description,
        description,
        oldImage
      } = req.body;

    if (req.file === undefined) {
      var imageName = oldImage;
    } else {
        var imageName = req.file.filename;
        //#################### delete old image #########################
        if (oldImage) fs.unlinkSync("./public/uploads/blog/" + oldImage);
    }

    const blogFields = {};

    if (blog_title) blogFields.blog_title = blog_title.charAt(0).toUpperCase() + blog_title.slice(1);
    if (blog_header) blogFields.blog_header = blog_header.charAt(0).toUpperCase() + blog_header.slice(1);
    if (meta_description) blogFields.meta_description = meta_description;
    else blogFields.meta_description = "";
    if (description) blogFields.description = description;
    blogFields.thumbnail = imageName;

    try {
      let blog = await Blog.findOneAndUpdate(
        { _id: req.params.blog_id },
        { $set: blogFields }
      );
      blog = await Blog.findOne({
        _id: req.params.blog_id
      }).select([
        "_id",
        "blog_title",
        "blog_header",
        "meta_description",
        "description",
        "thumbnail"
      ]);
      return response.successResponse(res, blog, "Blog Updated.");
    } catch (err) {
      // console.error(err.message);
      fs.unlinkSync("./public/uploads/blog/" + req.file.filename);    // delete image if error
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route DELETE api/admin/blog/:blog_id
// @desc Delete Blog by blog_id
// @access Private
router.delete("/:blog_id", auth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndRemove({
      _id: req.params.blog_id
    });
    
    //################# delete linked image ######################
    if (blog.thumbnail) fs.unlinkSync("./public/uploads/blog/" + blog.thumbnail);
    
    return response.successResponse(res, {}, "Blog deleted.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/admin/blog/change-status/:blog_id
// @desc change status of Blog by blog_id
// @access Private
router.post(
  "/change-status/:blog_id",
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
    const blogFields = {};

    if (status) blogFields.status = status;

    try {
      let blog = await Blog.findOneAndUpdate(
        { _id: req.params.blog_id },
        { $set: blogFields }
      );
      blog = {
        _id: req.params.blog_id,
        status: status
      };
      return response.successResponse(
        res,
        blog,
        "Blog status updated successfully."
      );
    } catch (err) {
      console.error(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);
module.exports = router;
