import fillDisputeOutcomeProgess from "modules/reports/selectors/fill-dispute-outcome-progress";
import { formatAttoRep } from "utils/format-number";

jest.mock("utils/format-number");

describe(`modules/reports/selectors/fill-dispute-outcome-progress.js`, () => {
  beforeEach(() => {
    formatAttoRep.mockImplementation(a => ({ formatted: a.toString() }));
  });

  test(`get remaining rep`, () => {
    const outcome = {
      bondSizeCurrent: 12588500976562500000,
      completedStake: "0",
      stakeCurrent: "1699361165364583300",
      accountStakeCurrent: "0"
    };
    const disputeBond = 12588500976562500000;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 13.4993,
      percentageAccount: 0
    };
    expect(actual).toEqual(expected);
  });

  test(`big numbers completed % both non and account`, () => {
    const outcome = {
      bondSizeCurrent: 2098083496093750000,
      stakeCurrent: "2098083496093750000",
      accountStakeCurrent: "1098083496093750000"
    };
    const disputeBond = 6294250488281250000;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 47.6625,
      percentageAccount: 52.3374
    };
    expect(actual).toEqual(expected);
  });

  test(`big numbers non account complete%`, () => {
    const outcome = {
      bondSizeCurrent: 2098083496093750000,
      stakeCurrent: "1098083496093750000",
      accountStakeCurrent: "0"
    };
    const disputeBond = 6294250488281250000;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 52.3374,
      percentageAccount: 0
    };
    expect(actual).toEqual(expected);
  });

  test(`big numbers account % complete, rounding up`, () => {
    const outcome = {
      bondSizeCurrent: 6294250488281250000,
      stakeCurrent: "349680582682291650",
      completedStake: "0",
      accountStakeCurrent: "133333582682291650"
    };
    const disputeBond = 6294250488281250000;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 3.4372,
      percentageAccount: 2.1183
    };
    expect(actual).toEqual(expected);
  });

  test(`big numbers account % complete, 10, total 50 complete `, () => {
    const outcome = {
      bondSizeCurrent: 20000000000000000000,
      stakeCurrent: "12000000000000000000",
      completedStake: "0",
      accountStakeCurrent: "2000000000000000000"
    };
    const disputeBond = 20000000000000000000;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 50,
      percentageAccount: 10
    };
    expect(actual).toEqual(expected);
  });

  test(`big numbers account % complete, 50 `, () => {
    const outcome = {
      bondSizeCurrent: 4000000000000000000,
      stakeCurrent: "2000000000000000000",
      completedStake: "0",
      accountStakeCurrent: "2000000000000000000"
    };
    const disputeBond = 2000000000000000000;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 0,
      percentageAccount: 50
    };
    expect(actual).toEqual(expected);
  });

  test(`big numbers % complete, 50 `, () => {
    const outcome = {
      bondSizeCurrent: 2000000000000000000,
      completedStake: "0",
      stakeCurrent: "1000000000000000000",
      accountStakeCurrent: 0
    };
    const disputeBond = 2000000000000000000;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 50,
      percentageAccount: 0
    };
    expect(actual).toEqual(expected);
  });

  test(`% complete, 75 `, () => {
    const outcome = {
      bondSizeCurrent: 10,
      stakeCurrent: "7.5",
      completedStake: "0",
      accountStakeCurrent: "0"
    };
    const disputeBond = 10;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 75,
      percentageAccount: 0
    };
    expect(actual).toEqual(expected);
  });

  test(`% complete, 50 `, () => {
    const outcome = {
      bondSizeCurrent: 10,
      stakeCurrent: "5",
      completedStake: "0",
      accountStakeCurrent: "0"
    };
    const disputeBond = 10;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 50,
      percentageAccount: 0
    };
    expect(actual).toEqual(expected);
  });

  test(`all zeros`, () => {
    const outcome = {
      bondSizeCurrent: 0,
      stakeCurrent: "0",
      completedStake: "0",
      accountStakeCurrent: "0"
    };
    const disputeBond = 0;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      ...outcome,
      percentageComplete: 0,
      percentageAccount: 0
    };
    expect(actual).toEqual(expected);
  });

  test(`empty object with bond`, () => {
    const outcome = {};
    const disputeBond = 10;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      percentageComplete: 0,
      percentageAccount: 0
    };
    expect(actual).toEqual(expected);
  });

  test(`empty object`, () => {
    const outcome = {};
    const disputeBond = 0;
    const actual = fillDisputeOutcomeProgess(disputeBond, outcome);
    const expected = {
      percentageComplete: 0,
      percentageAccount: 0
    };
    expect(actual).toEqual(expected);
  });
});
