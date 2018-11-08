import { selectMarketDisputeOutcomes } from "modules/reports/selectors/select-market-dispute-outcomes";

import fillDisputeOutcomeProgress from "modules/reports/selectors/fill-dispute-outcome-progress";
import selectDisputeOutcomes from "modules/reports/selectors/select-dispute-outcomes";

jest.mock("modules/reports/selectors/fill-dispute-outcome-progress");
jest.mock("modules/reports/selectors/select-dispute-outcomes");

describe(`modules/reports/selectors/select-market-dispute-outcomes.js`, () => {
  beforeEach(() => {
    fillDisputeOutcomeProgress.mockReturnValue([]);
    selectDisputeOutcomes.mockReturnValue([]);
  });

  describe("selectMarketDisputeOutcomes", () => {
    test(`selectMarketDisputeOutcomes, should return an empty object`, () => {
      const actual = selectMarketDisputeOutcomes.resultFunc([]);
      const expected = {};

      expect(actual).toEqual(expected);
    });

    describe("only disputing markets", () => {
      test(`When no dispute info, should return a mapping of market id to a list of outcomes`, () => {
        const marketData = [
          { id: "market1", reportingState: "PRE_REPORTING" },
          {
            id: "market2",
            reportingState: "AWAITING_NEXT_WINDOW",
            disputeInfo: {}
          },
          {
            id: "market3",
            reportingState: "CROWDSOURCING_DISPUTE",
            disputeInfo: {}
          }
        ];
        const universe = {
          forkThreshold: 1000000
        };

        const actual = selectMarketDisputeOutcomes.resultFunc(
          marketData,
          universe
        );

        const expected = {
          market2: [],
          market3: []
        };
        expect(actual).toEqual(expected);
      });
    });
  });
});
