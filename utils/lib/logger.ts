import winston from "winston";

const logFileName:string = 'logs/error.log';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const colors: winston.config.AbstractConfigSetColors  = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

function level() : string {
    const env: string | undefined = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
}

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
)

const transports: Array<any> = [
    new winston.transports.Console(),
];

const Logger: winston.Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
});

export default Logger;