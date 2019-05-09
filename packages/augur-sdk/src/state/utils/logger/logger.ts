export interface LoggerInterface {
  error(...err: Array<string | Error>): void;

  warn(...msg: Array<string>): void;

  info(...msg: Array<string>): void;

  info(...msg: Array<string>): void;

  debug(...msg: Array<string>): void;
}

export class Logger {
  private loggers: Array<LoggerInterface> = [];

  public addLogger(logger: LoggerInterface): void {
    this.loggers.push(logger);
  }

  public error(...err: Array<string | Error>): void {
    this.loggers.forEach((logger) => logger.error(...err));
  }

  public warn(...msg: Array<string>): void {
    this.loggers.forEach((logger) => logger.warn(...msg));
  }

  public info(...msg: Array<string>): void {
    this.loggers.forEach((logger) => logger.info(...msg));
  }

  public debug(...msg: Array<string>): void {
    this.loggers.forEach((logger) => logger.debug(...msg));
  }

  public clear(): void {
    this.loggers = [];
  }
}
