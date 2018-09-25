import { LoggerInterface } from "./logger";

export class StandardLogger implements LoggerInterface {
  public error(...err: Array<string | Error>): void {
    console.error(...err);
  }

  public warn(...msg: Array<string>): void {
    console.warn(...msg);
  }

  public info(...msg: Array<string>): void {
    console.info(...msg);
  }

  public debug(...msg: Array<string>): void {
    console.debug(...msg);
  }
}
