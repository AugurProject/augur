import * as mocks from "test/mockStore";
import { tradeTestState } from "test/tradeTestState";
import { augur } from "services/augurjs";
import { checkAccountAllowance } from "modules/auth/actions/approve-account";

const { placeTrade } = require("modules/trades/actions/place-trade.js");

const checkAllownaceActionObject = {
  type: "UPDATE_LOGIN_ACCOUNT",
  allowance: "0"
};
jest.mock("services/augurjs");
jest.mock("modules/auth/actions/approve-account");

describe(`modules/trades/actions/place-trade.js`, () => {
  beforeEach(() => {
    augur.rpc.getNetworkID.mockImplementation(() => "4");
    augur.trading.calculateTradeCost.mockImplementation();
    augur.trading.calculateTradeCost.mockReturnValue({
      onChainAmount: "1"
    });
    augur.trading.placeTrade.mockImplementation(() => {});
    checkAccountAllowance.mockImplementation(onSent => {
      onSent(null, "0");
      return checkAllownaceActionObject;
    });
  });

  test("should handle a null/undefined outcomeId", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = { privateKey: Buffer.from("PRIVATE_KEY", "utf8") };
    const store = mockStore(testState);
    store.dispatch(
      placeTrade({ marketId: "testYesNoMarketId", outcomeId: null })
    );
    store.clearActions();
    store.dispatch(
      placeTrade({ marketId: "testYesNoMarketId", outcomeId: undefined })
    );
  });
  test("should handle a null/undefined marketId", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = { privateKey: Buffer.from("PRIVATE_KEY", "utf8") };
    const store = mockStore(testState);
    store.dispatch(placeTrade({ marketId: null, outcomeId: "1" }));
    expect(store.getActions()).toEqual([]);
    store.clearActions();
    store.dispatch(placeTrade({ marketId: undefined, outcomeId: "1" }));
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

    store.dispatch(
      placeTrade({
        marketId: "testYesNoMarketId",
        outcomeId: "1",
        tradeInProgress: {
          totalCost: { value: "10000000" },
          sharesDepleted: "0",
          otherSharesDepleted: "0",
          limitPrice: "0.3",
          numShares: "1",
          side: "buy"
        }
      })
    );
    const storeActions = store.getActions();
    const approvalAction = storeActions[0];
    expect(storeActions).toHaveLength(2);
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
      placeTrade({
        marketId: "testYesNoMarketId",
        outcomeId: "1",
        tradeInProgress: {
          totalCost: { value: "10000000" },
          sharesDepleted: "0",
          otherSharesDepleted: "0",
          limitPrice: "0.3",
          numShares: "1",
          side: "buy"
        }
      })
    );
    const storeActions = store.getActions();
    expect(storeActions).toHaveLength(0);
    store.clearActions();
  });
});
