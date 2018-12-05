import {
  syncBlockchain,
  __RewireAPI__ as ReWireModule
} from "modules/app/actions/sync-blockchain";
import { describe, it, after } from "mocha";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import testState from "test/testState";

describe(`modules/app/actions/sync-blockchain.js`, () => {
  // eslint-disable-line func-names, prefer-arrow-callback
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
    currentAugurTimestamp: 42,
  };
  const syncData = {
    highestBlock: 22,
    lastProcessedBlock: 22,
  }
  const store = mockStore(state);
  const AugurJS = {
    rpc: {
      getCurrentBlock: () => ({
        number: 10000,
        timestamp: 4886718345
      }),
      block: {
        number: 10000,
        timestamp: 4886718345
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
      getSyncData: callback => {
        callback(null, {
          highestBlock: {
            number: 22
          },
          lastProcessedBlock: {
            number: 22
          },
        })
      }
    },
  };

  const updateBlockchain = data => ({
    type: "UPDATE_BLOCKCHAIN",
    data
  });
  const updateAssets = data => ({
    type: "UPDATE_ASSETS"
  });
  const loadGasPriceInfo = () => ({
    type: "UPDATE_GAS_PRICE_INFO"
  });
  ReWireModule.__Rewire__("augur", AugurJS);
  ReWireModule.__Rewire__("updateBlockchain", updateBlockchain);
  ReWireModule.__Rewire__("updateAssets", updateAssets);
  ReWireModule.__Rewire__("loadGasPriceInfo", loadGasPriceInfo);

  after(() => {
    store.clearActions();
    ReWireModule.__ResetDependency__(
      "augur",
      "updateBlockchain",
      "updateAssets",
      "loadGasPriceInfo"
    );
  });

  it("rpc.block set: should sync with blockchain using rpc.block.number", done => {
    AugurJS.rpc.block = {
      number: 10000,
      timestamp: "0x123456789"
    };
    const out = [
      {
        type: "UPDATE_BLOCKCHAIN",
        data: dataReturned
      },
      {
        type: "UPDATE_GAS_PRICE_INFO"
      },
      {
        type: "UPDATE_BLOCKCHAIN",
        data: syncData
      },
      {
        type: "UPDATE_ASSETS"
      }
    ];
    store.dispatch(syncBlockchain());
    assert.deepEqual(
      store.getActions(),
      out,
      `Didn't dispatch the expected actions`
    );

    done();
  });
});
