import winston from 'winston';

const logFormat = winston.format.printf((info) => {
  const { level, message, timestamp } = info;
  const formattedMessage =
    typeof message === 'string' ? message : JSON.stringify(message);
  return `${timestamp} [${level}]: ${formattedMessage}`;
});

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

export default logger;
