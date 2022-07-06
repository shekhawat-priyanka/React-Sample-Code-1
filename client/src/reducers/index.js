import { combineReducers } from "redux";
import auth from "./auth";
import alert from "./alert";
import errors from "./errors";
import emailTemplate from "./admin/emailTemplate";
import inquiry from "./admin/inquiry";
import setting from "./admin/setting";
import socialSetting from "./admin/socialSetting";
import blog from "./admin/blog";
import coupon from "./admin/coupon";

export default combineReducers({
  auth,
  alert,
  errors,
  emailTemplate,
  inquiry,
  setting,
  socialSetting,
  blog,
  coupon,
});
