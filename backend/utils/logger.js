import fs from "fs";
import path from "path";
import winston from "winston";
// now we desible it for production, because we are using morgan for logging http requests
// Ensure logs directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom format for winston
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  }),
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxfiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxfiles: 5,
    }),
  ],
});

export const logAuditEvent = (
  req,
  { actorId, action, targetModel, targetId, details },
) => {
  const ip = req
    ? req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip
    : "system";
  logger.info(
    `[AUDIT] Action: ${action} | Actor: ${actorId || "Guest/System"} | Target: ${targetModel || "N/A"}:${targetId || "N/A"} | IP: ${ip}`,
    {
      details,
    },
  );
};

export default logger;
