export default {
  items: [
    {
      name: "Dashboard",
      url: "/admin",
      icon: "icon-speedometer",
      badge: {
        variant: "info",
      },
    },
    {
      name: "Coupon code",
      url: "/admin/coupons",
      icon: "icon-list",
      badge: {
        variant: "info",
      },
    },
    {
      name: "CMS",
      icon: "icon-list",
      badge: {
        variant: "info",
      },
      children: [
        {
          name: "Blogs",
          url: "/admin/blogs",
          // icon: "icon-list",
          badge: {
            variant: "info",
          },
        },
        {
          name: "Email Templates",
          url: "/admin/email-templates",
          // icon: "icon-envelope-letter",
          badge: {
            variant: "info",
          },
        },
      ],
    },
    {
      name: "Inquiries",
      url: "/admin/inquiries",
      icon: "icon-question",
      badge: {
        variant: "info",
      },
    },
    {
      name: "Settings",
      url: "/admin/settings",
      icon: "icon-settings",
      badge: {
        variant: "info",
      },
    },
  ],
};
