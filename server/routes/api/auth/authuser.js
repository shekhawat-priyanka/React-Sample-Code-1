const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const UserModels = require("../../../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
var response = require("../../../config/response");

// @route GET api/auth
// @desc Test route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await UserModels.User.findById(req.user.id).select("-password");
    return response.successResponse(res, user, "User details");
  } catch (err) {
    console.log(err.message);
    await response.errorResponse(res, {}, "Server Error.", 500);
  }
});

// @route POST api/auth
// @desc Aunthicate user
// @access Public
router.post(
  "/",
  [
    check("email", "Enter valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return await response.errorResponse(res, errors.array());
    }
    const { email, password } = req.body;
    try {
      let user = await UserModels.User.findOne({ email });
      if (!user) {
        return await response.successResponse(
          res,
          {},
          "Invalid Credentials.",
          200,
          false
        );
      }
      const isMatch = true; //await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return await response.successResponse(
          res,
          {},
          "Invalid Credentials.",
          200,
          false
        );
      }
      else{
        let user_login = await UserModels.User.findOneAndUpdate({ email },{last_login: Date.now()});
      }

      if( user.status != 2){
        if(user.status == 1){
          var errormsg = "Sorry, This user is In-active. Please contact to administrator.";
        }
        else {
          var errormsg = "Sorry, This user is blocked. Please contact to administrator.";
        }
        //console.log("user.status");
        return await response.successResponse(
          res,
          {},
          errormsg,
          200,
          false
        );

      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          return response.successResponse(res, { token, user }, "Auth User.");
        }
      );
    } catch (err) {
      await response.errorResponse(res, {}, "Server Error.", 500);
      // res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;
