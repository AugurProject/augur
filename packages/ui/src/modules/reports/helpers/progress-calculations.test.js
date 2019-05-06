import {
  calculateAddedStakePercentage,
  calculatePercentage,
  calculateTentativeCurrentRep
} from "modules/reports/helpers/progress-calculations";
import { createBigNumber } from "src/utils/create-big-number";
import { formatAttoRep } from "utils/format-number";

jest.mock("utils/format-number");

describe(`modules/reports/helpers/progress-calculations.js`, () => {
  beforeEach(() => {
    formatAttoRep.mockImplementation(a => ({ formatted: a.toString() }));
  });

  test(`value remaining tentative stake REP`, () => {
    expect(
      calculateTentativeCurrentRep(
        createBigNumber("34000000000000000000", 10),
        1
      )
    ).toEqual("35000000000000000000");
  });

  test(`large value remaining tentative stake REP`, () => {
    expect(
      calculateTentativeCurrentRep(createBigNumber("349680582682291650", 10), 1)
    ).toEqual("1349680582682291700");
  });

  test(`add REP stake get percentage`, () => {
    expect(
      calculateAddedStakePercentage(createBigNumber("10", 10), 0, 1)
    ).toEqual(10);
  });

  test(`add REP stake get percentage`, () => {
    expect(
      calculateAddedStakePercentage(
        createBigNumber("20", 10),
        createBigNumber("10", 10),
        1
      )
    ).toEqual(55);
  });

  test(`0 numbers, percentage calculation`, () => {
    expect(calculatePercentage(0, 5)).toEqual(0);
  });

  test(`null numbers, percentage calculation`, () => {
    expect(calculatePercentage(null, 5)).toEqual(0);
  });

  test(`negative numbers, percentage calculation`, () => {
    expect(calculatePercentage(-10, 5)).toEqual(0);
  });

  test(`small numbers, percentage calculation`, () => {
    expect(calculatePercentage(10, 5)).toEqual(50);
  });

  test(`large percentage calculation`, () => {
    expect(
      calculatePercentage(
        createBigNumber("2098083496093750000", 10),
        createBigNumber("109680582682291650", 10)
      )
    ).toEqual(5.2276);
  });
});
