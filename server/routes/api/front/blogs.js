const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/auth");
const Blog = require("../../../models/Blog");
var response = require("../../../config/response");

// @route GET api/admin/blog
// @desc Get all blog
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
        $lookup: {
          localField: "user_id",
          from: "users",
          foreignField: "_id",
          as: "userinfo"
        }
      },
      { $unwind: "$userinfo" },
      {
        $project: {
          title: "$title",
          description: "$description",
          posted_by: {
            $concat: ["$userinfo.first_name", " ", "$userinfo.last_name"]
          },
          created_at: "$created_at"
        }
      },
      {
        $match: {
          //[{ page_title: { $regex: query, $options: "i" } }]
          $and: [
            {
              $or: [
                { title: { $regex: query, $options: "i" } },
                { posted_by: { $regex: query, $options: "i" } }
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

// @route POST api/blogs
// @desc Create a blog
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required.")
        .not()
        .isEmpty(),
      check("description", "Description is required.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return await response.errorResponse(res, errors.array());
    }

    try {
      const newBlog = new Blog({
        title: req.body.title,
        description: req.body.description,
        user: req.user.id
      });

      const blog = await newBlog.save();
      return response.successResponse(res, blog, "CMS Page Created.");
    } catch (err) {
      // console.error(err.message);
      return response.errorResponse(res, {}, "Server Error.", 500);
    }
  }
);

// @route GET api/blogs/:id
// @desc Get blog by ID
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return response.errorResponse(
        res,
        { msg: "Blog not found." },
        "Blog not found.",
        400
      );
    return response.successResponse(res, blog, "CMS pages data.");
  } catch (err) {
    console.error(err.message);
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

// @route DELETE api/blogs/:id
// @desc Delete the blog by id
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return response.errorResponse(
        res,
        { msg: "Blog not found." },
        "Blog not found.",
        400
      );
    }

    // Check on user
    if (blog.user.toString() != req.user.id) {
      return response.errorResponse(
        res,
        { msg: "User not authorized." },
        "User not authorized.",
        401
      );
    }

    await blog.remove();
    return response.successResponse(res, {}, "Blog deleted.");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
});

module.exports = router;
