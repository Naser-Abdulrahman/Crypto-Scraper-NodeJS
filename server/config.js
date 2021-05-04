const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PUBLIC_KEY: process.env.SHRIMPY_API_PUBLIC_KEY,
  PRIVATE_KEY: process.env.SHRIMPY_API_PRIVATE_KEY,
  URL: process.env.URL,
  PORT: process.env.PORT,
  LOG_FILE_PATH: process.env.LOG_FILE_PATH,
  LOG_LEVEL: process.env.LOG_LEVEL,
};
