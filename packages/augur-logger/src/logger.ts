import { LoggerLevels } from './index';

export interface LoggerInterface {
  error(...err: Array<string | Error>): void;

  warn(...msg: string[]): void;

  log(...msg: string[]): void;

  info(...msg: string[]): void;

  debug(...msg: string[]): void;

  table(...tabularData: any[]): void

  time(label:string): void;

  timeEnd(label:string): void;
}

export class Logger {
  private _logLevel:LoggerLevels = LoggerLevels.info;
  private loggers: LoggerInterface[] = [];

  set logLevel(level: LoggerLevels) {
    this._logLevel = level;
  }

  get logLevel() {
    return this._logLevel;
  }

  addLogger(logger: LoggerInterface): void {
    this.loggers.push(logger);
  }

  error(...err: Array<string | Error>): void {
    if(this._logLevel > LoggerLevels.error) return;
    this.loggers.forEach((logger) => logger.error(...err));
  }

  warn(...msg: string[]): void {
    if(this._logLevel > LoggerLevels.warn) return;
    this.loggers.forEach((logger) => logger.warn(...msg));
  }

  log(...msg: string[]): void {
    if(this._logLevel > LoggerLevels.log) return;
    this.loggers.forEach((logger) => logger.log(...msg));
  }

  info(...msg: string[]): void {
    if(this._logLevel > LoggerLevels.info) return;
    this.loggers.forEach((logger) => logger.info(...msg));
  }

  debug(...msg: string[]): void {
    if(this._logLevel > LoggerLevels.debug) return;
    this.loggers.forEach((logger) => logger.debug(...msg));
  }

  table(logLevel:LoggerLevels, ...tabularData: any[]) {
    if(this._logLevel > logLevel) return;
    this.loggers.forEach((logger) => logger.table(...tabularData))
  }

  time(logLevel:LoggerLevels, label:string) {
    if(this._logLevel > logLevel) return;
    this.loggers.forEach((logger) => logger.time(label));
  }

  timeEnd(logLevel:LoggerLevels, label:string) {
    if(this._logLevel > logLevel) return;
    this.loggers.forEach((logger) => logger.timeEnd(label));
  }

  clear(): void {
    this.loggers = [];
  }
}
