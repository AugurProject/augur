import { syncBlockchain } from "modules/app/actions/sync-blockchain";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";

import * as updateBlockChainModule from "modules/app/actions/update-blockchain";
import * as updateAssetsModule from "modules/auth/actions/update-assets";
import * as loadGadPriceInfoModule from "modules/app/actions/load-gas-price-info";

jest.mock("services/augurjs", () => ({
  augur: {
    rpc: {
      getNetworkID: () => 4,
      getCurrentBlock: () => ({
        number: 10000,
        timestamp: 4886718345
      }),
      block: {
        number: 10000,
        timestamp: "0x123456789"
      }
    },
    api: {
      Controller: {
        getTimestamp: callback => {
          callback(null, 42);
        }
      }
    },
    augurNode: {
      getSyncData: () => ({
        highestBlock: { number: 111 },
        lastProcessedBlock: { number: 110 }
      })
    }
  }
}));

jest.mock("modules/app/actions/update-blockchain");
jest.mock("modules/auth/actions/update-assets");
jest.mock("modules/app/actions/load-gas-price-info");

describe(`modules/app/actions/sync-blockchain.js`, () => {
  let updateBlockchainSpy;
  let updateAssetsSpy;
  let loadGasPriceInfoSpy;

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
    currentBlockNumber: 0x10000,
    currentBlockTimestamp: 0x4886718345,
    currentAugurTimestamp: 42
  };
  const store = mockStore(state);

  beforeAll(() => {
    updateBlockchainSpy = jest
      .spyOn(updateBlockChainModule, "updateBlockchain")
      .mockImplementation(data => ({
        type: "UPDATE_BLOCKCHAIN",
        data
      }));

    updateAssetsSpy = jest
      .spyOn(updateAssetsModule, "updateAssets")
      .mockImplementation(() => ({
        type: "UPDATE_ASSETS"
      }));

    loadGasPriceInfoSpy = jest
      .spyOn(loadGadPriceInfoModule, "loadGasPriceInfo")
      .mockImplementation(() => ({
        type: "UPDATE_GAS_PRICE_INFO"
      }));
  });

  afterAll(() => {
    store.clearActions();
    updateBlockchainSpy.mockReset();
    updateAssetsSpy.mockReset();
    loadGasPriceInfoSpy.mockReset();
  });

  test("rpc.block set: should sync with blockchain using rpc.block.number", done => {
    store.dispatch(syncBlockchain());
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_BLOCKCHAIN",
        data: dataReturned
      },
      {
        type: "UPDATE_ASSETS"
      }
    ]);
    done();
  });
});
