import { describe, it } from "mocha";
import { assert } from "chai";
import * as sinon from "sinon";
import { Logger, LoggerInterface } from "../../../src/utils/logger/logger";

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
    const spy = sinon.spy<LoggerInterface>(exampleLogger, method);

    const exampleMsg = "Some example message";

    const logger = new Logger();
    logger.addLogger(exampleLogger);

    describe(`${method} method`, () => {
      it(`should call the ${method} method of passed logger`, () => {
        logger[method].call(logger, exampleMsg);
        assert.isOk(spy.calledWith(exampleMsg), `${method} was not called with message`);
      });
    });
  });
});
