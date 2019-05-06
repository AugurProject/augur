import { BigNumber, createBigNumber } from "src/utils/create-big-number";
import logError from "utils/log-error";

jest.mock("utils/log-error");

describe("src/utils/wrapped-big-number.js", () => {
  test("should console an error when a undefined is passed", () => {
    const result = createBigNumber(undefined);
    expect(result).toBeUndefined();
    expect(logError).toBeCalled();
  });

  test("should console an error when a null value is passed", () => {
    const result = createBigNumber(null);
    expect(result).toBeUndefined();
    expect(logError).toBeCalled();
  });

  test("should return a bignumber", () => {
    const result = createBigNumber("2500");
    expect(result).toBeInstanceOf(BigNumber);
    expect(logError).not.toBeCalled();
  });

  test("should act like a big number", () => {
    expect(
      createBigNumber(2)
        .plus(createBigNumber(4))
        .toString()
    ).toEqual("6");
  });

  test("should sort like a big number", () => {
    const expected = [{ value: "77" }, { value: "12" }, { value: "4" }];
    const myObjectArray = [{ value: "12" }, { value: "4" }, { value: "77" }];
    const result = myObjectArray.sort((a, b) =>
      createBigNumber(a.value).isLessThan(createBigNumber(b.value))
    );
    expect(result).toEqual(expected);
  });
});
