export interface LoggerInterface {
  error(...err: Array<string | Error>): void;

  warn(...msg: string[]): void;

  info(...msg: string[]): void;

  info(...msg: string[]): void;

  debug(...msg: string[]): void;
}

export class Logger {
  private loggers: LoggerInterface[] = [];

  addLogger(logger: LoggerInterface): void {
    this.loggers.push(logger);
  }

  error(...err: Array<string | Error>): void {
    this.loggers.forEach((logger) => logger.error(...err));
  }

  warn(...msg: string[]): void {
    this.loggers.forEach((logger) => logger.warn(...msg));
  }

  info(...msg: string[]): void {
    this.loggers.forEach((logger) => logger.info(...msg));
  }

  debug(...msg: string[]): void {
    this.loggers.forEach((logger) => logger.debug(...msg));
  }

  clear(): void {
    this.loggers = [];
  }
}
