import { Logger, LoggerInterface } from "src/utils/logger/logger";

describe("utils/logger", () => {
  class ExampleLogger implements LoggerInterface {
    public error(...err: Array<string | Error>) {
    }

    public warn(...msg: Array<string>) {
    }

    public info(...msg: Array<string>) {
    }

    public debug(...msg: Array<string>) {
    }
  }

  ["error", "info", "warn", "debug"].map((method: keyof LoggerInterface) => {
    const exampleLogger = new ExampleLogger();
    const spy = jest.spyOn<LoggerInterface>(exampleLogger, method);

    const exampleMsg = "Some example message";

    const logger = new Logger();
    logger.addLogger(exampleLogger);

    describe(`${method} method`, () => {
      test(`should call the ${method} method of passed logger`, () => {
        logger[method].call(logger, exampleMsg);
        expect(spy).toHaveBeenCalledWith(exampleMsg);
      });
    });
  });
});
