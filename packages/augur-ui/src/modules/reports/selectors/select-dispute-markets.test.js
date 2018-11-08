import { selectUniverseState } from "src/select-state";

import { selectMarkets } from "modules/markets/selectors/markets-all";
import { selectMarketsInDisputeSelector } from "modules/reports/selectors/select-dispute-markets";

jest.mock("modules/markets/selectors/markets-all");
jest.mock("src/select-state");

describe(`modules/reports/selectors/select-dispute-markets.js`, () => {
  describe("selectMarketsInDispute", () => {
    beforeEach(() => {
      selectUniverseState.mockReturnValue({
        forkingMarket: "",
        isForking: false
      });
    });

    test(`should return 3 elements expected array`, () => {
      selectMarkets.mockImplementation(() => [
        {
          id: "0xMARKETID1",
          reportingState: "PRE_REPORTING"
        },
        {
          id: "0xMARKETID2",
          reportingState: "FINALIZED"
        },
        {
          id: "0xMARKETID3",
          reportingState: "CROWDSOURCING_DISPUTE",
          disputeInfo: {
            stakes: [
              {
                bondSizeCurrent: "204",
                stakeCurrent: "50",
                tentativeWinning: false
              },
              {
                stakeCurrent: "0",
                tentativeWinning: true
              }
            ],
            disputeRound: 0
          }
        },
        {
          id: "0xMARKETID4",
          reportingState: "CROWDSOURCING_DISPUTE",
          disputeInfo: {
            stakes: [
              {
                bondSizeCurrent: "204",
                stakeCurrent: "70",
                tentativeWinning: false
              },
              {
                stakeCurrent: "0",
                tentativeWinning: true
              }
            ],
            disputeRound: 0
          }
        },
        {
          id: "0xMARKETID5",
          reportingState: "CROWDSOURCING_DISPUTE",
          disputeInfo: {
            stakes: [
              {
                bondSizeCurrent: "30000",
                stakeCurrent: "0",
                tentativeWinning: false
              },
              {
                bondSizeCurrent: "30000",
                stakeCurrent: "30000",
                tentativeWinning: true
              }
            ],
            disputeRound: 2
          }
        }
      ]);

      const actual = selectMarketsInDisputeSelector()();
      expect(actual).toEqual([
        {
          id: "0xMARKETID5",
          reportingState: "CROWDSOURCING_DISPUTE",
          disputeInfo: {
            highestPercentStaked: "0",
            stakes: [
              {
                bondSizeCurrent: "30000",
                stakeCurrent: "0",
                tentativeWinning: false
              },
              {
                bondSizeCurrent: "30000",
                stakeCurrent: "30000",
                tentativeWinning: true
              }
            ],
            disputeRound: 2
          }
        },
        {
          id: "0xMARKETID4",
          reportingState: "CROWDSOURCING_DISPUTE",
          disputeInfo: {
            highestPercentStaked: "0.34313725490196078431",
            stakes: [
              {
                bondSizeCurrent: "204",
                stakeCurrent: "70",
                tentativeWinning: false
              },
              {
                stakeCurrent: "0",
                tentativeWinning: true
              }
            ],
            disputeRound: 0
          }
        },
        {
          id: "0xMARKETID3",
          reportingState: "CROWDSOURCING_DISPUTE",
          disputeInfo: {
            highestPercentStaked: "0.24509803921568627451",
            stakes: [
              {
                bondSizeCurrent: "204",
                stakeCurrent: "50",
                tentativeWinning: false
              },
              {
                stakeCurrent: "0",
                tentativeWinning: true
              }
            ],
            disputeRound: 0
          }
        }
      ]);
    });
    test(`should return zero elements array`, () => {
      selectMarkets.mockImplementation(() => [
        {
          id: "0xMARKETID1",
          reportingState: "PRE_REPORTING"
        },
        {
          id: "0xMARKETID2",
          reportingState: "FINALIZED"
        },
        {
          id: "0xMARKETID3",
          reportingState: "PRE_REPORTING"
        }
      ]);
      const actual = selectMarketsInDisputeSelector()();
      expect(actual).toEqual([]);
    });
  });
});
