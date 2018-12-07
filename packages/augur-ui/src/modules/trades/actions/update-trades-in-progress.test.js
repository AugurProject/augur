import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";
import { BUY, SELL, tradeTestState } from "test/tradeTestState";
import { loadUsershareBalances } from "modules/positions/actions/load-user-share-balances";

function updateTradesInProgressActionShapeAssertion(
  updateTradesInProgressAction
) {
  const updateTradesInProgressData = updateTradesInProgressAction.data;
  const tradeDetails = updateTradesInProgressData.details;

  expect(updateTradesInProgressAction.type).toBeDefined();
  expect(typeof updateTradesInProgressAction.type).toBe("string");
  expect(updateTradesInProgressAction.data).toBeDefined();
  expect(typeof updateTradesInProgressAction.data).toBe("object");

  expect(updateTradesInProgressData.marketId).toBeDefined();
  expect(typeof updateTradesInProgressData.marketId).toBe("string");
  expect(updateTradesInProgressData.outcomeId).toBeDefined();
  expect(typeof updateTradesInProgressData.outcomeId).toBe("number");
  expect(updateTradesInProgressData.details).toBeDefined();
  expect(typeof updateTradesInProgressData.details).toBe("object");

  expect(tradeDetails.side).toBeDefined();
  expect(typeof tradeDetails.side).toBe("string");
  expect(tradeDetails.numShares).toBeDefined();
  expect(typeof tradeDetails.numShares).toBe("string");
  expect(tradeDetails.limitPrice).toBeDefined();
  expect(typeof tradeDetails.limitPrice).toBe("string" || "object");
  expect(tradeDetails.totalFee).toBeDefined();
  expect(typeof tradeDetails.totalFee).toBe("string");
  expect(tradeDetails.totalCost).toBeDefined();
  expect(typeof tradeDetails.totalCost).toBe("string");
  expect(tradeDetails.feePercent).toBeDefined();
  expect(typeof tradeDetails.feePercent).toBe("string");
}

jest.mock("modules/positions/actions/load-user-share-balances");
describe("modules/trades/actions/update-trades-in-progress.js", () => {
  describe("should update a trade in progress for a yes/no market", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const state = Object.assign({}, testState, tradeTestState);
    const store = mockStore(state);
    loadUsershareBalances.mockImplementation((options, callback) => () =>
      callback(null, [])
    );

    const {
      updateTradesInProgress
    } = require("modules/trades/actions/update-trades-in-progress");

    beforeEach(() => {
      store.clearActions();
    });

    afterEach(() => {
      store.clearActions();
    });

    test("should pass shape tests for buying 10 shares of YES at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    test("should pass calculation tests for buying 10 shares of YES at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "10",
            sharesFilled: "0",
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "5",
            shareBalances: ["0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should pass shape tests for Selling 10 shares of YES at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 1,
          side: SELL,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    test("should pass calculation tests for selling 10 shares of YES at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 1,
          side: SELL,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testYesNoMarketId",
          outcomeId: 1,
          details: {
            side: "sell",
            numShares: "10",
            sharesFilled: "10",
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "5",
            shareBalances: ["10", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should reset the tradeDetails object if 0 shares are passed in as a buy", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "0"
          }
        }
      });
    });

    test("should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: undefined,
          limitPrice: "0.5",
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "0"
          }
        }
      });
    });

    test("should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.", () => {
      // set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testYesNoMarketId: {
          0: {
            side: BUY,
            numShares: "10",
            limitPrice: "0.5",
            totalFee: "0.01",
            totalCost: "-5.01",
            feePercent: "0.2",
            worstCaseFees: "0"
          }
        }
      };
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: undefined,
          limitPrice: "0.15",
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "10",
            sharesFilled: "0",
            limitPrice: "0.15",
            totalFee: "0",
            totalCost: "1.5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "1.5",
            shareBalances: ["0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should handle the tradeDetails object if limitPrice is unchanged but share number changes", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "25",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "25",
            sharesFilled: "0",
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "12.5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "12.5",
            shareBalances: ["0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "-25",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testYesNoMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "25",
            sharesFilled: "0",
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "12.5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "12.5",
            shareBalances: ["0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });
  });

  describe("should update a trade in progress for a categorical market", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const state = Object.assign({}, testState, tradeTestState);
    const store = mockStore(state);
    loadUsershareBalances.mockImplementation((options, callback) => () =>
      callback(null, [])
    );

    const {
      updateTradesInProgress
    } = require("modules/trades/actions/update-trades-in-progress");

    beforeEach(() => {
      store.clearActions();
    });

    afterEach(() => {
      store.clearActions();
    });

    test("should pass shape tests for buying 10 shares of Outcome 0 at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    test("should pass calculation tests for buying 10 shares of Outcome 1 at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 1,
          side: BUY,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testCategoricalMarketId",
          outcomeId: 1,
          details: {
            side: "buy",
            numShares: "10",
            sharesFilled: "0.005",
            limitPrice: "0.7",
            totalFee: "0",
            totalCost: "7",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "7",
            shareBalances: ["0", "0.005", "0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should pass shape tests for Selling 10 shares of Outcome 0 at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          side: SELL,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    test("should pass calculation tests for selling 10 shares of Outcome 1 at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 1,
          side: SELL,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testCategoricalMarketId",
          outcomeId: 1,
          details: {
            side: "sell",
            numShares: "10",
            sharesFilled: "10",
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "5",
            shareBalances: ["10", "0", "10", "10"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should reset the tradeDetails object if 0 shares are passed in as a buy", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "0"
          }
        }
      });
    });

    test("should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: undefined,
          limitPrice: "0.5",
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "0"
          }
        }
      });
    });

    test("should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.", () => {
      // set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testCategoricalMarketId: {
          0: {
            side: BUY,
            numShares: "10",
            limitPrice: "0.5",
            totalFee: "0.004999999999999995",
            totalCost: "-5.004999999999999995",
            tradeActions: [
              {
                action: "BID",
                shares: "10",
                feeEth: "0.004999999999999995",
                feePercent: "0.0999999999999999",
                costEth: "-5.004999999999999995",
                avgPrice: "0.500499999999999999",
                noFeePrice: "0.5"
              }
            ],
            tradingFeesEth: "0.004999999999999995",
            feePercent: "0.099800399201596707"
          }
        }
      };
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: undefined,
          limitPrice: "0.15",
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "10",
            sharesFilled: "0",
            limitPrice: "0.15",
            totalFee: "0",
            totalCost: "1.5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "1.5",
            shareBalances: ["0", "0", "0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should handle the tradeDetails object if limitPrice is unchanged but share number changes", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "25",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "25",
            sharesFilled: "0",
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "12.5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "12.5",
            shareBalances: ["0", "0", "0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "-25",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testCategoricalMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "25",
            sharesFilled: "0",
            limitPrice: "0.5",
            totalFee: "0",
            totalCost: "12.5",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "12.5",
            shareBalances: ["0", "0", "0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });
  });

  describe("should update a trade in progress for a scalar market", () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const state = Object.assign({}, testState, tradeTestState);
    const store = mockStore(state);
    loadUsershareBalances.mockImplementation((options, callback) => () =>
      callback(null, ["0", "0"])
    );

    const {
      updateTradesInProgress
    } = require("modules/trades/actions/update-trades-in-progress");

    beforeEach(() => {
      store.clearActions();
    });

    afterEach(() => {
      store.clearActions();
    });

    test("should pass shape tests for buying 10 shares of outcome1 at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 1,
          side: BUY,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    test("should pass calculation tests for buying 10 shares of outcome 1 at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 1,
          side: BUY,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testScalarMarketId",
          outcomeId: 1,
          details: {
            side: "buy",
            numShares: "10",
            sharesFilled: "0.5",
            limitPrice: "55",
            totalFee: "0",
            totalCost: "650",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "650",
            shareBalances: ["0", "0.5"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should pass shape tests for Selling 10 shares of outcome 1 at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 1,
          side: SELL,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    test("should pass calculation tests for selling 10 shares of outcome1 at the default limitPrice", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 1,
          side: SELL,
          numShares: "10.0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testScalarMarketId",
          outcomeId: 1,
          details: {
            side: "sell",
            numShares: "10",
            sharesFilled: "1.5",
            limitPrice: "50",
            totalFee: "0",
            totalCost: "600",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "600",
            shareBalances: ["1.5", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should reset the tradeDetails object if 0 shares are passed in as a buy", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "0",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testScalarMarketId",
          outcomeId: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: "50",
            totalFee: "0",
            totalCost: "0"
          }
        }
      });
    });

    test("should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: undefined,
          limitPrice: "65",
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testScalarMarketId",
          outcomeId: 0,
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: "65",
            totalFee: "0",
            totalCost: "0"
          }
        }
      });
    });

    test("should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.", () => {
      // set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testScalarMarketId: {
          0: {
            side: BUY,
            numShares: "10",
            limitPrice: "55",
            totalFee: "5.36982248520710025",
            totalCost: "-555.36982248520710025",
            feePercent: "0.9763313609467455"
          }
        }
      };
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: undefined,
          limitPrice: "70",
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testScalarMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "10",
            sharesFilled: "0",
            limitPrice: "70",
            totalFee: "0",
            totalCost: "800",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "800",
            shareBalances: ["0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should handle the tradeDetails object if limitPrice is unchanged but share number changes", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "25",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testScalarMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "25",
            sharesFilled: "0",
            limitPrice: "55",
            totalFee: "0",
            totalCost: "1625",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "1625",
            shareBalances: ["0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: "-25",
          limitPrice: undefined,
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testScalarMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "25",
            sharesFilled: "0",
            limitPrice: "55",
            totalFee: "0",
            totalCost: "1625",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "1625",
            shareBalances: ["0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });

    test("should handle the tradeDetails object if limitPrice is negative but valid for this scalar market", () => {
      store.dispatch(
        updateTradesInProgress({
          marketId: "testScalarMarketId",
          outcomeId: 0,
          side: BUY,
          numShares: undefined,
          limitPrice: "-5",
          maxCost: undefined
        })
      );
      expect(store.getActions()[0]).toEqual({
        type: "UPDATE_TRADE_IN_PROGRESS",
        data: {
          marketId: "testScalarMarketId",
          outcomeId: 0,
          details: {
            side: "buy",
            numShares: "10",
            sharesFilled: "0",
            limitPrice: "-5",
            totalFee: "0",
            totalCost: "50",
            feePercent: "0",
            settlementFees: "0",
            shareCost: "0",
            sharesDepleted: "0",
            otherSharesDepleted: "0",
            tokensDepleted: "50",
            shareBalances: ["0", "0"],
            worstCaseFees: "0",
            tradeGroupId: store.getActions()[0].data.details.tradeGroupId
          }
        }
      });
    });
  });
});
