import Dashboard from "views/Admin/Dashboard";

import CreateEmailTemplate from "views/Admin/EmailTemplate/CreateEmailTemplate";
import EmailTemplateList from "views/Admin/EmailTemplate/EmailTemplateList";
import EditEmailTemplate from "views/Admin/EmailTemplate/EditEmailTemplate";

import AddInquiry from "views/Admin/Inquiries/AddInquiry";
import InquiriesList from "views/Admin/Inquiries/InquiriesList";
import EditInquiry from "views/Admin/Inquiries/EditInquiry";

import WebsiteSetting from "views/Admin/Settings/WebsiteSetting";
import SocialSetting from "views/Admin/Settings/SocialSetting";

import EditBlog from "views/Admin/Blogs/EditBlog";
import CreateBlog from "views/Admin/Blogs/CreateBlog";
import BlogsList from "views/Admin/Blogs/BlogsList";

import AddCoupon from "views/Admin/Coupon/AddCoupon";
import CouponList from "views/Admin/Coupon/CouponList";
import EditCoupon from "views/Admin/Coupon/EditCoupon";

const AdminRoutes = [
  { path: "/admin", exact: true, name: "Dashboard", component: Dashboard },
  {
    path: "/admin/email-templates",
    exact: true,
    name: "Email Template List",
    component: EmailTemplateList,
  },
  {
    path: "/admin/email-templates/create",
    exact: true,
    name: "Create Email Template",
    component: CreateEmailTemplate,
  },
  {
    path: "/admin/email-templates/:emailTemplate_id",
    name: "Edit Email Template",
    component: EditEmailTemplate,
  },
  {
    path: "/admin/coupons",
    exact: true,
    name: "Coupon List",
    component: CouponList,
  },
  {
    path: "/admin/coupons/add",
    exact: true,
    name: "Add Coupon",
    component: AddCoupon,
  },
  {
    path: "/admin/coupons/:coupon_id",
    name: "Edit Coupon",
    component: EditCoupon,
  },
  {
    path: "/admin/blogs",
    exact: true,
    name: "Blogs List",
    component: BlogsList,
  },
  {
    path: "/admin/blogs/create",
    exact: true,
    name: "Create Blog",
    component: CreateBlog,
  },
  {
    path: "/admin/blogs/:blog_id",
    name: "Edit Blog",
    component: EditBlog,
  },
  {
    path: "/admin/inquiries",
    exact: true,
    name: "Inquiries List",
    component: InquiriesList,
  },
  {
    path: "/admin/inquiries/add",
    exact: true,
    name: "Add Inquiry",
    component: AddInquiry,
  },
  {
    path: "/admin/inquiries/:inquiry_id",
    name: "Edit Inquiry",
    component: EditInquiry,
  },

  {
    path: "/admin/settings",
    exact: true,
    name: "Website Settings",
    component: WebsiteSetting,
  },

  {
    path: "/admin/social-settings",
    exact: true,
    name: "Social Settings",
    component: SocialSetting,
  },
];

export default AdminRoutes;
