import { constants } from "src/services/constants";
import { selectMarketsAwaitingDispute } from "modules/reports/selectors/select-awaiting-dispute-markets";

jest.mock("modules/markets/selectors/markets-all");

describe(`modules/reports/selectors/select-awaiting-dispute-markets.js`, () => {
  describe("selectMarketsAwaitingDispute", () => {
    test(`should return an empty array`, () => {
      const actual = selectMarketsAwaitingDispute.resultFunc([]);

      const expected = [];

      expect(actual).toEqual(expected);
    });

    test(`should return an array populated with matching market objects`, () => {
      const actual = selectMarketsAwaitingDispute.resultFunc(
        [
          {
            id: "0xshouldpass1",
            reportingState: constants.REPORTING_STATE.AWAITING_NEXT_WINDOW,
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
            id: "0xshouldpass2",
            reportingState: constants.REPORTING_STATE.AWAITING_NEXT_WINDOW,
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
            id: "0xshouldpass3",
            reportingState: constants.REPORTING_STATE.AWAITING_NEXT_WINDOW,
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
          },
          {
            id: "0xshouldnt",
            reportingState: "fail"
          }
        ],
        {},
        {
          forkingMarket: ""
        }
      );

      const expected = [
        {
          id: "0xshouldpass3",
          reportingState: constants.REPORTING_STATE.AWAITING_NEXT_WINDOW,
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
          id: "0xshouldpass2",
          reportingState: constants.REPORTING_STATE.AWAITING_NEXT_WINDOW,
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
          id: "0xshouldpass1",
          reportingState: constants.REPORTING_STATE.AWAITING_NEXT_WINDOW,
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
      ];

      expect(actual).toEqual(expected);
    });
  });
});
