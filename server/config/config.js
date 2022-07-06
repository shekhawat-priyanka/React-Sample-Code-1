const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  //PORT: 5006,

  APP_NAME: process.env.APP_NAME,
  APP_ENV: process.env.APP_ENV,
  APP_URL: process.env.APP_URL,

  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,

  MAIL_DRIVER: process.env.MAIL_DRIVER,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_ENCRYPTION: process.env.MAIL_ENCRYPTION,
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  MONGO_URI: process.env.MONGO_URI
};
