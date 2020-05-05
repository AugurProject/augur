import { StandardLogger } from './StandardLogger';
import { Logger } from './logger';

const standardLogger = new StandardLogger();

export enum LoggerLevels {
  debug,
  info,
  log,
  warn,
  error,
}

// Export as singleton.
export const logger = new Logger();
logger.addLogger(standardLogger);
