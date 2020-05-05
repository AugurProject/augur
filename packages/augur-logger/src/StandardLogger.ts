import {LoggerInterface} from "./logger";

export class StandardLogger implements LoggerInterface {
  error(...err: Array<string | Error>): void {
    console.error(...err);
  }

  warn(...msg: string[]): void {
    console.warn(...msg);
  }

  log(...msg: string[]): void {
    console.info(...msg);
  }

  info(...msg: string[]): void {
    console.info(...msg);
  }

  debug(...msg: string[]): void {
    console.debug(...msg);
  }

  table(...tabularData: any[]): void {
    console.table(...tabularData);
  }

  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }
}

