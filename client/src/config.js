const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  PORT: process.env.REACT_APP_PORT,
  CHOKIDAR_USEPOLLING: process.env.REACT_APP_CHOKIDAR_USEPOLLING,
  APP_NAME: process.env.REACT_APP_APP_NAME,
  SERVER_URL: process.env.REACT_APP_SERVER_URL,
  DISPLAY_DATE_FORMATE: process.env.REACT_APP_DISPLAY_DATE_FORMATE,
  DEFAULT_DATE_FORMAT: process.env.REACT_APP_DEFAULT_DATE_FORMAT,
};
