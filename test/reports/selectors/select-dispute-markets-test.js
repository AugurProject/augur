import proxyquire from "proxyquire";

describe(`modules/reports/selectors/select-dispute-markets.js`, () => {
  proxyquire.noPreserveCache().noCallThru();

  const test = t => {
    it(t.description, () => {
      t.assertions();
    });
  };

  describe("default", () => {
    test({
      description: `should not get any markets`,
      assertions: () => {
        const mockMarketsAll = {
          selectMarkets: () => []
        };
        const mockSelectUniverseState = {
          selectUniverseState: () => ({
            forkingMarket: "",
            isForking: false
          })
        };
        const selector = proxyquire(
          "../../../src/modules/reporting/selectors/select-dispute-markets.js",
          {
            "../../markets/selectors/markets-all": mockMarketsAll,
            "../../../select-state": mockSelectUniverseState
          }
        );

        const actual = selector.selectMarketsInDispute();
        assert.deepEqual(actual, [], `Didn't call the expected method`);
      }
    });
  });

  describe("selectMarketsInDispute", () => {
    test({
      description: `should return zero elements array`,
      assertions: () => {
        const mockMarketsAll = {
          selectMarkets: () => [
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
          ]
        };
        const mockSelectUniverseState = {
          selectUniverseState: () => ({
            forkingMarket: "",
            isForking: false
          })
        };
        const selector = proxyquire(
          "../../../src/modules/reporting/selectors/select-dispute-markets.js",
          {
            "../../markets/selectors/markets-all": mockMarketsAll,
            "../../../select-state": mockSelectUniverseState
          }
        );

        const actual = selector.selectMarketsInDispute();
        assert.deepEqual(actual, [], `Didn't return the expected array`);
      }
    });
  });

  describe("selectMarketsInDispute", () => {
    test({
      description: `should return 3 elements expected array`,
      assertions: () => {
        const mockMarketsAll = {
          selectMarkets: () => [
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
          ]
        };
        const mockSelectUniverseState = {
          selectUniverseState: () => ({
            forkingMarket: "",
            isForking: false
          })
        };
        const selector = proxyquire(
          "../../../src/modules/reporting/selectors/select-dispute-markets.js",
          {
            "../../markets/selectors/markets-all": mockMarketsAll,
            "../../../select-state": mockSelectUniverseState
          }
        );

        const actual = selector.selectMarketsInDispute();

        const expected = [
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
        ];

        assert.deepEqual(actual, expected, `Didn't return the expected array`);
      }
    });
  });
});
