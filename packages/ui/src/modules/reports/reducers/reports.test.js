import testState from "test/testState";
import reducer from "modules/reports/reducers/reports";

describe(`modules/reports/reducers/reports.js`, () => {
  const testStateReports = Object.assign(
    {},
    testState.reports[testState.universe.id]
  );
  const state = Object.assign({}, testState);

  afterEach(() => {
    testState.reports[testState.universe.id] = Object.assign(
      {},
      testStateReports
    );
  });

  describe(`UPDATE_REPORTS`, () => {
    test("should update reports", () => {
      expect(
        reducer(state.reports, {
          type: "UPDATE_REPORTS",
          data: {
            reportsData: {
              [testState.universe.id]: {
                test: {
                  marketId: "test",
                  example: "example",
                  isScalar: false,
                  isIndeterminate: false
                },
                example: {
                  marketId: "example",
                  test: "test",
                  isScalar: false,
                  isIndeterminate: false
                }
              }
            }
          }
        })
      ).toEqual({
        [testState.universe.id]: {
          test: {
            marketId: "test",
            example: "example",
            isScalar: false,
            isIndeterminate: false
          },
          example: {
            marketId: "example",
            test: "test",
            isScalar: false,
            isIndeterminate: false
          },
          testMarketId: {
            marketId: "testMarketId",
            isScalar: false,
            isSubmitted: false,
            isIndeterminate: false
          }
        },
        markets: []
      });
    });
  });

  describe("UPDATE_REPORT", () => {
    const runTests = t =>
      test(t.description, () =>
        t.assertions(
          reducer(t.state.reports, {
            type: "UPDATE_REPORT",
            data: {
              universeId: t.params.universeId,
              marketId: t.params.marketId,
              report: t.params.report
            }
          })
        )
      );
    runTests({
      description: "no report data",
      params: {
        universeId: "0xb1",
        marketId: "0xe3",
        report: {}
      },
      state: {
        reports: {
          "0xb1": {
            "0xe1": {
              marketId: "0xe1",
              period: 6
            },
            "0xe2": {
              marketId: "0xe2",
              period: 7
            }
          }
        }
      },
      assertions: reduced => {
        expect(reduced).toEqual({
          "0xb1": {
            "0xe1": {
              marketId: "0xe1",
              period: 6
            },
            "0xe2": {
              marketId: "0xe2",
              period: 7
            },
            "0xe3": {
              marketId: "0xe3"
            }
          }
        });
      }
    });
    runTests({
      description: "insert new report",
      params: {
        universeId: "0xb1",
        marketId: "0xe3",
        report: {
          period: 7
        }
      },
      state: {
        reports: {
          "0xb1": {
            "0xe1": {
              marketId: "0xe1",
              period: 6
            },
            "0xe2": {
              marketId: "0xe2",
              period: 7
            }
          }
        }
      },
      assertions: reduced => {
        expect(reduced).toEqual({
          "0xb1": {
            "0xe1": {
              marketId: "0xe1",
              period: 6
            },
            "0xe2": {
              marketId: "0xe2",
              period: 7
            },
            "0xe3": {
              marketId: "0xe3",
              period: 7
            }
          }
        });
      }
    });
    runTests({
      description: "update existing report",
      params: {
        universeId: "0xb1",
        marketId: "0xe2",
        report: {
          period: 8,
          reportedOutcomeId: "2"
        }
      },
      state: {
        reports: {
          "0xb1": {
            "0xe1": {
              marketId: "0xe1",
              period: 6
            },
            "0xe2": {
              marketId: "0xe2",
              period: 7
            }
          }
        }
      },
      assertions: reduced => {
        expect(reduced).toEqual({
          "0xb1": {
            "0xe1": {
              marketId: "0xe1",
              period: 6
            },
            "0xe2": {
              marketId: "0xe2",
              period: 8,
              reportedOutcomeId: "2"
            }
          }
        });
      }
    });
    runTests({
      description: "insert first report on universe",
      params: {
        universeId: "0xb1",
        marketId: "0xe1",
        report: {
          period: 7
        }
      },
      state: {
        reports: {}
      },
      assertions: reduced => {
        expect(reduced).toEqual({
          "0xb1": {
            "0xe1": {
              marketId: "0xe1",
              period: 7
            }
          }
        });
      }
    });
  });
});
