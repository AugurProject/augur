import proxyquire from "proxyquire";
import sinon from "sinon";
import * as mocks from "test/mockStore";
import { tradeTestState } from "test/trades/constants";
import { createBigNumber } from "utils/create-big-number";

describe(`modules/trades/actions/place-trade.js`, () => {
  proxyquire.noPreserveCache();
  it("should handle a null/undefined outcomeId", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = { privateKey: Buffer.from("PRIVATE_KEY", "utf8") };
    const store = mockStore(testState);
    const SelectMarket = { selectMarket: () => {} };
    sinon
      .stub(SelectMarket, "selectMarket")
      .callsFake(marketId => store.getState().marketsData[marketId]);
    const action = proxyquire(
      "../../../src/modules/trades/actions/place-trade.js",
      {
        "../../markets/selectors/market": SelectMarket
      }
    );
    store.dispatch(
      action.placeTrade({ marketId: "testYesNoMarketId", outcomeId: null })
    );
    assert.deepEqual(
      store.getActions(),
      [
        {
          type: "CLEAR_TRADE_IN_PROGRESS",
          data: { marketId: "testYesNoMarketId" }
        }
      ],
      `Didn't produce the expected actions for passing a null outcomeId to place-trade`
    );
    store.clearActions();
    store.dispatch(
      action.placeTrade({ marketId: "testYesNoMarketId", outcomeId: undefined })
    );
    assert.deepEqual(
      store.getActions(),
      [
        {
          type: "CLEAR_TRADE_IN_PROGRESS",
          data: { marketId: "testYesNoMarketId" }
        }
      ],
      `Didn't produce the expected actions for passing a undefined outcomeId to place-trade`
    );
  });
  it("should handle a null/undefined marketId", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = { privateKey: Buffer.from("PRIVATE_KEY", "utf8") };
    const store = mockStore(testState);
    const SelectMarket = { selectMarket: () => {} };
    sinon
      .stub(SelectMarket, "selectMarket")
      .callsFake(marketId => store.getState().marketsData[marketId]);
    const action = proxyquire(
      "../../../src/modules/trades/actions/place-trade.js",
      {
        "../../markets/selectors/market": SelectMarket
      }
    );
    store.dispatch(action.placeTrade({ marketId: null, outcomeId: "1" }));
    assert.deepEqual(
      store.getActions(),
      [],
      `Didn't fail out as expected for passing a null marketId to place-trade`
    );
    store.clearActions();
    store.dispatch(action.placeTrade({ marketId: undefined, outcomeId: "1" }));
    assert.deepEqual(
      store.getActions(),
      [],
      `Didn't fail out as expected for passing a undefined marketId to place-trade`
    );
  });
  it("should handle a allowance less than totalCost", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = {
      meta: { privateKey: Buffer.from("PRIVATE_KEY", "utf8") },
      allowance: "0"
    };
    const store = mockStore(testState);
    const CheckAccountAllowance = { checkAccountAllowance: () => {} };
    const SelectMarket = { selectMarket: () => {} };
    const checkAllownaceActionObject = {
      type: "UPDATE_LOGIN_ACCOUNT",
      allowance: "0"
    };
    sinon
      .stub(SelectMarket, "selectMarket")
      .callsFake(marketId => store.getState().marketsData[marketId]);
    sinon
      .stub(CheckAccountAllowance, "checkAccountAllowance")
      .callsFake(onSent => {
        onSent(null, "0");
        return checkAllownaceActionObject;
      });
    const action = proxyquire(
      "../../../src/modules/trades/actions/place-trade.js",
      {
        "../../markets/selectors/market": SelectMarket,
        "../../auth/actions/approve-account": CheckAccountAllowance
      }
    );
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
    // note this is backwards... mock needs to be changed.
    const approvalAction = storeActions[0];
    assert.deepEqual(
      storeActions.length,
      2,
      "more/less actions dispatched then expected"
    );
    // again, it should be first, but for now check 2nd.
    assert.deepEqual(
      storeActions[1],
      checkAllownaceActionObject,
      `first action wasn't a call to checkAllowanceActionObject`
    );
    assert.isObject(approvalAction);
    assert.deepEqual(approvalAction.type, "UPDATE_MODAL");
    assert.isObject(approvalAction.data);
    assert.isObject(approvalAction.data.modalOptions);
    const { modalOptions } = approvalAction.data;
    assert.deepEqual(modalOptions.type, "MODAL_ACCOUNT_APPROVAL");
    assert.isFunction(modalOptions.approveCallback);
    store.clearActions();
  });
  it("should handle a allowance greater than total (no approval needed.)", () => {
    const { state, mockStore } = mocks.default;
    const testState = { ...state, ...tradeTestState };
    testState.loginAccount = {
      meta: { privateKey: Buffer.from("PRIVATE_KEY", "utf8") },
      allowance: "10000000000000000000000000000000000000000000"
    };
    const store = mockStore(testState);
    const CheckAccountAllowance = { checkAccountAllowance: () => {} };
    const SelectMarket = { selectMarket: () => {} };
    const AugurJS = {
      augur: {
        trading: {
          placeTrade: () => {},
          calculateTradeCost: () => ({
            onChainAmount: createBigNumber("100000000000")
          })
        }
      }
    };
    const checkAllownaceActionObject = {
      type: "UPDATE_LOGIN_ACCOUNT",
      allowance: "10000000000000000000000000000000000000000000"
    };
    sinon
      .stub(SelectMarket, "selectMarket")
      .callsFake(marketId => store.getState().marketsData[marketId]);
    sinon
      .stub(CheckAccountAllowance, "checkAccountAllowance")
      .callsFake(() => checkAllownaceActionObject);
    sinon.stub(AugurJS.augur.trading, `placeTrade`).callsFake(params => {
      assert.isObject(params);
      assert.isFunction(params.onSent);
      assert.isFunction(params.onSuccess);
      assert.isFunction(params.onFailed);
    });
    const action = proxyquire(
      "../../../src/modules/trades/actions/place-trade.js",
      {
        "../../markets/selectors/market": SelectMarket,
        "../../auth/actions/approve-account": CheckAccountAllowance,
        "../../../services/augurjs": AugurJS
      }
    );
    store.dispatch(
      action.placeTrade({
        marketId: "testYesNoMarketId",
        outcomeId: "1",
        tradeInProgress: {
          totalCost: "10000000",
          sharesDepleted: "0",
          otherSharesDepleted: "0",
          limitPrice: "0.3",
          amount: "1",
          side: "buy"
        }
      })
    );
    const storeActions = store.getActions();
    assert.deepEqual(
      storeActions.length,
      1,
      "more actions dispatched then expected"
    );
    const Expected = [
      {
        type: "CLEAR_TRADE_IN_PROGRESS",
        data: { marketId: "testYesNoMarketId" }
      }
    ];
    assert.deepEqual(
      storeActions,
      Expected,
      `Only Action should be to clear trade in progress`
    );
    store.clearActions();
  });
});
