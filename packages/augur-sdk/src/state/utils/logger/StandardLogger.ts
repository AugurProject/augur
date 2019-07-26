import {LoggerInterface} from "./logger";

export class StandardLogger implements LoggerInterface {
  error(...err: Array<string | Error>): void {
    console.error(...err);
  }

  warn(...msg: string[]): void {
    console.warn(...msg);
  }

  info(...msg: string[]): void {
    console.info(...msg);
  }

  debug(...msg: string[]): void {
    console.debug(...msg);
  }
}
