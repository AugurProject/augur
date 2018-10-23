import { selectReportingCycle } from "modules/universe/selectors/reporting-cycle";
import * as augurModule from "services/augurjs";

jest.mock("services/augurjs", () => ({
  augur: {
    rpc: {
      constants: []
    },
    reporting: {
      getCurrentPeriodProgress: () => {}
    }
  },
  constants: []
}));

describe(`modules/universe/selectors/reporting-cycle.js`, () => {
  let getCurrentPeriodProgressSpy;

  beforeEach(() => {
    getCurrentPeriodProgressSpy = jest.spyOn(
      augurModule.augur.reporting,
      "getCurrentPeriodProgress"
    );
  });

  afterEach(() => {
    getCurrentPeriodProgressSpy.mockRestore();
  });

  test("Reporting cycle is 51% complete", () => {
    const state = {
      blockchain: {
        currentBlockTimestamp: 123456789
      },
      universe: {
        reportingPeriodDurationInSeconds: 100
      }
    };

    getCurrentPeriodProgressSpy.mockReturnValue(51);

    const result = selectReportingCycle(state);
    expect(result).toEqual({
      currentReportingPeriodPercentComplete: 51,
      reportingCycleTimeRemaining: "in a minute"
    });
  });

  test("Reporting cycle is 0% complete", () => {
    const state = {
      blockchain: {
        currentBlockTimestamp: 123456789
      },
      universe: {
        reportingPeriodDurationInSeconds: 2678400
      }
    };

    getCurrentPeriodProgressSpy.mockReturnValue(0);

    const result = selectReportingCycle(state);

    expect(result).toEqual({
      currentReportingPeriodPercentComplete: 0,
      reportingCycleTimeRemaining: "in a month"
    });
  });

  test("Reporting cycle is 100% complete", () => {
    const state = {
      blockchain: {
        currentBlockTimestamp: 123456789
      },
      universe: {
        // This must be distinct to avoid selector caching.
        reportingPeriodDurationInSeconds: 121
      }
    };

    getCurrentPeriodProgressSpy.mockReturnValue(100);

    const result = selectReportingCycle(state);
    expect(result).toEqual({
      currentReportingPeriodPercentComplete: 100,
      reportingCycleTimeRemaining: "a few seconds ago"
    });
  });
});
