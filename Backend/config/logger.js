const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'finance-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp, stack, ...meta }) => {
            return `[${timestamp}] ${level}: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ''
            } ${stack ? '\n' + stack : ''}`;
          }
        )
      )
    })
  ]
});

module.exports = logger;
