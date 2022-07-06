const mongoose = require("mongoose");
const EmailTemplate = require("./models/EmailTemplate");
const config = require("config");
const db = config.get("mongoURI");
try {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
} catch (err) {
  process.exit(1);
}

let emailTemplate = [
  new EmailTemplate({
    subject: "Password reset request",
    slug: "reset-link-created",
    dynamic_parameters: "",
    description:
      '<h4><strong>Hello!</strong></h4><p>You are receiving this email because we received a password reset request for your account.</p><p>Your password reset link is:</p><p><a href="{{link}}">{{link}}</a></p><p>If you did not request a password reset, no further action is required.</p><p>Regards,&nbsp;<br>{{app_name}}</p><p>{{copyright_year}} {{app_name}}. All right reserved.</p>',
    status: "1",
  }),
  new EmailTemplate({
    subject: "Password reset successful",
    slug: "password-reset-successful",
    dynamic_parameters: "full_name",
    description:
      "<h4><strong>Dear {{full_name}},</strong></h4><p>You have successfully changed your password.&nbsp;<br>If you did not change password, immediately contact to Administrator.</p><p>&nbsp;</p><p>Regards,<br>{{app_name}}</p><p>{{copyright_year}} {{app_name}}. All right reserved.</p>",
    status: "1",
  }),
  new EmailTemplate({
    subject: "Welcome to {{app_name}}",
    slug: "new-user-created-welcome-email",
    dynamic_parameters: "full_name,email,password,first_name",
    description:
      '<h4><strong>Dear {{full_name}},</strong></h4><p>Welcome to {{app_name}}.</p><p>You can log in to our app <p><a href="{{app_url}}">{{app_url}}</a></p> by :</p><p>User name : {{email}}</p><p>Password : {{password}}</p><p>Kind regards</p><p>{{app_name}},</p><p>{{copyright_year}} {{app_name}}. All right reserved.</p><p>&nbsp;</p>',
    status: "1",
  }),
];

emailTemplate.map(async (email, index) => {
  await email.save((err, result) => {
    if (index === emailTemplate.length - 1) {
      console.log("MongoDB disconnected");
      mongoose.disconnect();
    }
  });
});
