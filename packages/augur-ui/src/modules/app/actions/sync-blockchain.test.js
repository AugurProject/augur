import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";
import { augur } from "services/augurjs";
import { updateAssets } from "modules/auth/actions/update-assets";
import { loadGasPriceInfo } from "modules/app/actions/load-gas-price-info";

jest.mock("services/augurjs");
jest.mock("modules/app/actions/load-gas-price-info");
jest.mock("modules/auth/actions/update-assets");

describe(`modules/app/actions/sync-blockchain.js`, () => {
  augur.rpc = jest.fn(() => {});
  augur.api = jest.fn(() => {});
  augur.api.Controller = jest.fn(() => {});
  augur.rpc.getCurrentBlock = jest.fn(() => ({
    timestamp: 0x4886718345,
    number: 9999
  }));
  augur.api.Controller.getTimestamp = jest.fn(cb => {
    cb(null, 42);
  });
  updateAssets.mockImplementation(() => ({ type: "UPDATE_ASSETS" }));
  loadGasPriceInfo.mockImplementation(() => ({
    type: "UPDATE_GAS_PRICE_INFO"
  }));

  const { syncBlockchain } = require("modules/app/actions/sync-blockchain");

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState, {
    blockchain: {
      currentBlockTimestamp: 4886718335,
      currentBlockNumber: 9999,
      currentAugurTimestamp: 42
    },
    gasPriceInfo: {
      blockNumber: undefined
    }
  });
  const dataReturned = {
    blockchainData: {
      currentBlockNumber: 39321,
      currentBlockTimestamp: 53964437656617,
      currentAugurTimestamp: 42
    }
  };
  const store = mockStore(state);

  test("rpc.block set: should sync with blockchain using rpc.block.number", () => {
    const out = [
      {
        type: "UPDATE_BLOCKCHAIN",
        data: dataReturned
      },
      {
        type: "UPDATE_GAS_PRICE_INFO"
      },
      {
        type: "UPDATE_ASSETS"
      }
    ];
    store.dispatch(syncBlockchain());
    expect(store.getActions()).toEqual(out);
  });
});
