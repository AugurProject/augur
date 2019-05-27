import { selectReportableOutcomes } from "modules/reports/selectors/reportable-outcomes";
import {
  CATEGORICAL,
  YES_NO,
  YES_NO_NO_ID,
  YES_NO_NO_OUTCOME_NAME,
  YES_NO_YES_ID,
  YES_NO_YES_OUTCOME_NAME
} from "modules/common-elements/constants";

describe("modules/reports/selectors/reportable-outcomes.js", () => {
  let actual;
  let expected;

  test("should return the correct array for a YES_NO market", () => {
    actual = selectReportableOutcomes(YES_NO);
    expected = [
      {
        id: `${YES_NO_NO_ID}`,
        name: YES_NO_NO_OUTCOME_NAME
      },
      {
        id: `${YES_NO_YES_ID}`,
        name: YES_NO_YES_OUTCOME_NAME
      }
    ];

    expect(actual).toEqual(expected);
    // assertions.reportableOutcomes(actual);
  });

  test("should return the correct array for a CATEGORICAL market", () => {
    const outcomes = [
      {
        id: "3",
        name: "out3"
      },
      {
        id: "1",
        name: "out1"
      },
      {
        id: "2",
        name: "out2"
      }
    ];

    actual = selectReportableOutcomes(CATEGORICAL, outcomes);
    expected = [
      {
        id: "3",
        name: "out3"
      },
      {
        id: "1",
        name: "out1"
      },
      {
        id: "2",
        name: "out2"
      }
    ];

    expect(actual).toEqual(expected);
  });

  test("should return the correct array for DEFAULT case", () => {
    actual = selectReportableOutcomes(null);
    expected = [];

    expect(actual).toEqual(expected);
  });
});
