import formatTimePassed from "utils/format-time-passed";

describe("utils/format-time-passed.js", () => {
  test("should format time passed", () => {
    expect(formatTimePassed(999)).toEqual("less than a second ago");
    expect(formatTimePassed(1000)).toEqual("00:01 ago");
    expect(formatTimePassed(1001)).toEqual("00:01 ago");
    expect(formatTimePassed(1999)).toEqual("00:01 ago");
    expect(formatTimePassed(2000)).toEqual("00:02 ago");
    expect(formatTimePassed(59999)).toEqual("00:59 ago");
    expect(formatTimePassed(60000)).toEqual("01:00 ago");
    expect(formatTimePassed(60001)).toEqual("01:00 ago");
    expect(formatTimePassed(60002)).toEqual("01:00 ago");
    expect(formatTimePassed(70000)).toEqual("01:10 ago");
    expect(formatTimePassed(3599000)).toEqual("59:59 ago");
    expect(formatTimePassed(3600000)).toEqual("hour ago");
    expect(formatTimePassed(3600001)).toEqual("more than hour ago");
    expect(formatTimePassed(24 * 60 * 60 * 1001)).toEqual("more than hour ago");
  });
});
