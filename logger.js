const { format, createLogger, transports } = require("winston");
const { combine, printf, errors } = format;
const {
  PapertrailConnection,
  PapertrailTransport,
} = require("winston-papertrail");

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${level}]: ${stack || message}`;
});

loggerTransports = [];
let level = null;
if (process.env.NODE_ENV === "prod") {
  loggerTransports.push(new transports.Console());
  level = "debug";
  // const papertrailConnection = new PapertrailConnection({
  //   host: "logs5.papertrailapp.com",
  //   port: 14979,
  // });

  // loggerTransports.push(new PapertrailTransport(papertrailConnection));
  // level = "info";
} else {
  loggerTransports.push(new transports.Console());
  level = "debug";
}

module.exports = createLogger({
  level,
  format: combine(
    format.colorize(),
    errors({ stack: true }), //prints stacktrace
    logFormat
  ),
  transports: loggerTransports,
});
