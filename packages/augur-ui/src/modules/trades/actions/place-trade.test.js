import * as mocks from "test/mockStore";
import { tradeTestState } from "test/trades/constants";
import { augur } from "services/augurjs";

const action = require("modules/trades/actions/place-trade.js");

const checkAllownaceActionObject = {
  type: "UPDATE_LOGIN_ACCOUNT",
  allowance: "0"
};
jest.mock("services/augurjs");
jest.mock("modules/auth/actions/approve-account").fn(onSent => {
  onSent(null, "0");
  return checkAllownaceActionObject;
});
beforeEach(() => {
  augur.trading = jest.fn(() => {});
  augur.trading.calculateTradeCost = jest.fn();
  augur.trading.calculateTradeCost.mockReturnValue({
    onChainAmount: "1"
  });
});

describe(`modules/trades/actions/place-trade.js`, () => {
  test("should handle a null/undefined outcomeId", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = { privateKey: Buffer.from("PRIVATE_KEY", "utf8") };
    const store = mockStore(testState);
    store.dispatch(
      action.placeTrade({ marketId: "testYesNoMarketId", outcomeId: null })
    );
    expect(store.getActions()).toEqual([
      {
        type: "CLEAR_TRADE_IN_PROGRESS",
        data: { marketId: "testYesNoMarketId" }
      }
    ]);
    store.clearActions();
    store.dispatch(
      action.placeTrade({ marketId: "testYesNoMarketId", outcomeId: undefined })
    );
    expect(store.getActions()).toEqual([
      {
        type: "CLEAR_TRADE_IN_PROGRESS",
        data: { marketId: "testYesNoMarketId" }
      }
    ]);
  });
  test("should handle a null/undefined marketId", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = { privateKey: Buffer.from("PRIVATE_KEY", "utf8") };
    const store = mockStore(testState);
    store.dispatch(action.placeTrade({ marketId: null, outcomeId: "1" }));
    expect(store.getActions()).toEqual([]);
    store.clearActions();
    store.dispatch(action.placeTrade({ marketId: undefined, outcomeId: "1" }));
    expect(store.getActions()).toEqual([]);
  });
  test("should handle a allowance less than totalCost", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = {
      meta: { privateKey: Buffer.from("PRIVATE_KEY", "utf8") },
      allowance: "0"
    };
    const store = mockStore(testState);
    augur.rpc = jest.fn(() => {});
    augur.rpc.getNetworkID = jest.fn(() => "4");
    // checkAccountAllowance

    store.dispatch(
      action.placeTrade({
        marketId: "testYesNoMarketId",
        outcomeId: "1",
        tradeInProgress: {
          totalCost: "10000000",
          sharesDepleted: "0",
          otherSharesDepleted: "0",
          limitPrice: "0.3",
          numShares: "1",
          side: "buy"
        }
      })
    );
    const storeActions = store.getActions();
    console.log(storeActions);
    // note this is backwards... mock needs to be changed.
    const approvalAction = storeActions[0];
    expect(storeActions).toHaveLength(2);
    // again, it should be first, but for now check 2nd.
    // expect(storeActions[1]).toEqual(checkAllownaceActionObject);
    expect(typeof approvalAction).toBe("object");
    expect(approvalAction.type).toEqual("UPDATE_MODAL");
    expect(typeof approvalAction.data).toBe("object");
    expect(typeof approvalAction.data.modalOptions).toBe("object");
    const { modalOptions } = approvalAction.data;
    expect(modalOptions.type).toEqual("MODAL_ACCOUNT_APPROVAL");
    expect(typeof modalOptions.approveCallback).toBe("function");
    store.clearActions();
  });
  test("should handle a allowance greater than total (no approval needed.)", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = {
      meta: { privateKey: Buffer.from("PRIVATE_KEY", "utf8") },
      allowance: "10000000000000000000000000000000000000000000"
    };
    const store = mockStore(testState);
    // const action = require("./place-trade.js");
    store.dispatch(
      action.placeTrade({
        marketId: "testYesNoMarketId",
        outcomeId: "1",
        tradeInProgress: {
          totalCost: "10000000",
          sharesDepleted: "0",
          otherSharesDepleted: "0",
          limitPrice: "0.3",
          numShares: "1",
          side: "buy"
        }
      })
    );
    const storeActions = store.getActions();
    expect(storeActions).toHaveLength(1);
    const Expected = [
      {
        type: "CLEAR_TRADE_IN_PROGRESS",
        data: { marketId: "testYesNoMarketId" }
      }
    ];
    expect(storeActions).toEqual(Expected);
    store.clearActions();
  });
});
