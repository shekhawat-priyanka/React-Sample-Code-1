const nodemailer = require("nodemailer");
const EmailTemplate = require("../models/EmailTemplate");

const {
  APP_NAME,
  APP_URL,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
} = require("../config/config");

module.exports = async (slug, input) => {
  input.app_name = APP_NAME;
  input.app_url = APP_URL;
  input.copyright_year = new Date().getFullYear();

  slug = slug.toLowerCase().replace(/\s/g, "");

  const template = await EmailTemplate.findOne({
    slug: slug,
  }).select(["subject", "slug", "dynamic_parameters", "description", "status"]);

  if (!(template === null)) {
    let email_subject = template.subject;
    email_subject = email_subject.replace("{{app_name}}", input.app_name);
    let email_body = template.description;
    let dynamic_parameters = template.dynamic_parameters;

    dynamic_parameters = dynamic_parameters.replace(/\s/g, "").split(",");
    dynamic_parameters.push("app_name");
    dynamic_parameters.push("app_url");
    dynamic_parameters.push("copyright_year");
    dynamic_parameters.push("link");
    dynamic_parameters.forEach((value) => {
      var replace_string = new RegExp("{{" + value + "}}", "g");
      email_body = email_body.replace(replace_string, input[value]);
    });

    var transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: MAIL_FROM_ADDRESS,
      to: input.email,
      subject: email_subject,
      html: email_body,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    });
    return true;
  } else return false;
};
