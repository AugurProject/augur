import sinon from "sinon";
import marketsAwaitingDispute, {
  __RewireAPI__,
  selectMarketsAwaitingDispute
} from "modules/reports/selectors/select-awaiting-dispute-markets";

describe(`modules/reports/selectors/select-awaiting-dispute-markets.js`, () => {
  const test = t => test(t.description, done => t.assertions(done));

  describe("default method", () => {
    test({
      description:
        "should call `selectMarketsAwaitingDispute` from the default function",
      assertions: done => {
        const stubbedSelectMarketsAwaitingDispute = sinon.stub();
        __RewireAPI__.__Rewire__(
          "selectMarketsAwaitingDispute",
          stubbedSelectMarketsAwaitingDispute
        );

        marketsAwaitingDispute();

        expect(stubbedSelectMarketsAwaitingDispute.calledOnce).toBe(true);

        __RewireAPI__.__ResetDependency__("selectMarketsAwaitingDispute");

        done();
      }
    });
  });

  describe("selectMarketsAwaitingDispute", () => {
    test({
      description: `should return an empty array`,
      assertions: done => {
        const actual = selectMarketsAwaitingDispute.resultFunc([]);

        const expected = [];

        expect(actual).toEqual(expected);

        done();
      }
    });

    test({
      description: `should return an array populated with matching market objects`,
      assertions: done => {
        __RewireAPI__.__Rewire__("constants", {
          REPORTING_STATE: {
            AWAITING_NEXT_WINDOW: "test"
          }
        });

        const actual = selectMarketsAwaitingDispute.resultFunc(
          [
            {
              id: "0xshouldpass1",
              reportingState: "test",
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
              reportingState: "test",
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
              reportingState: "test",
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
            reportingState: "test",
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
            reportingState: "test",
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
            reportingState: "test",
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

        __RewireAPI__.__ResetDependency__("constants");

        done();
      }
    });
  });
});
