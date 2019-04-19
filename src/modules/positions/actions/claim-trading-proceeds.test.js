import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { augur } from "services/augurjs";

jest.mock("services/augurjs");

describe(`modules/positions/actions/claim-trading-proceeds.js`, () => {
  augur.api = jest.fn(() => {});
  augur.api.ClaimTradingProceeds = jest.fn(() => {});
  augur.api.ClaimTradingProceeds.claimTradingProceeds = jest.fn(value => {
    value.onSuccess();
  });

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const claimTradingProceeds = require("modules/positions/actions/claim-trading-proceeds")
    .default;

  test("no marketId for claiming", () => {
    const state = {
      universe: {
        id: "0xb1",
        currentReportingWindowAddress: 7
      },
      loginAccount: {
        address: "0xb0b"
      }
    };
    const store = mockStore(state);
    store.dispatch(claimTradingProceeds(null));
    expect(
      augur.api.ClaimTradingProceeds.claimTradingProceeds
    ).toHaveBeenCalledTimes(0);

    expect(store.getActions()).toEqual([]);
  });

  test("account not logged in", () => {
    const state = {
      universe: {
        id: "0xb1",
        currentReportingWindowAddress: 7
      },
      loginAccount: {
        address: null
      }
    };
    const store = mockStore(state);
    store.dispatch(claimTradingProceeds("0xmarketId"));
    expect(
      augur.api.ClaimTradingProceeds.claimTradingProceeds
    ).toHaveBeenCalledTimes(0);

    expect(store.getActions()).toEqual([]);
  });

  test("claim successful", () => {
    const state = {
      universe: {
        id: "0xb1",
        currentReportingWindowAddress: 7
      },
      loginAccount: {
        address: "0xb0b"
      }
    };

    const marketId = "0x0000001";
    const store = mockStore(state);
    store.dispatch(claimTradingProceeds(marketId));
    expect(
      augur.api.ClaimTradingProceeds.claimTradingProceeds
    ).toHaveBeenCalledTimes(1);
  });

  test("claim failed", () => {
    const state = {
      universe: {
        id: "0xb1",
        currentReportingWindowAddress: 7
      },
      loginAccount: {
        address: "0xb0b"
      }
    };

    augur.api.ClaimTradingProceeds.claimTradingProceeds = jest.fn(value => {
      value.onFailed();
    });

    const marketId = "0x0000001";
    const store = mockStore(state);
    store.dispatch(claimTradingProceeds(marketId));
    expect(
      augur.api.ClaimTradingProceeds.claimTradingProceeds
    ).toHaveBeenCalledTimes(1);

    expect(store.getActions()).toHaveLength(2);
  });
});
