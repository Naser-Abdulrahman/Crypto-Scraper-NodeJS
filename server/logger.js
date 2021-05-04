const winston = require("winston");
const fs = require("fs");
const { transport } = require("winston");
const { LOG_LEVEL, LOG_FILE_PATH } = require("./config");

const logConfiguration = {
  level: LOG_LEVEL,
  format: winston.format.json(),
};

if (fs.existsSync(LOG_FILE_PATH)) {
  transports: [
    new winston.transports.File({
      filename: LOG_FILE_PATH,
    }),
  ],
    (logConfiguration["transports"] = transports);
} else {
  console.log(`Invalid ${LOG_FILE_PATH}... logs wont be saved`);
}

module.exports = {
  logger: winston.createLogger(logConfiguration),
};
