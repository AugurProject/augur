import { createBigNumber } from "utils/create-big-number";

import proxyquire from "proxyquire";
import sinon from "sinon";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

describe(`modules/positions/actions/claim-trading-proceeds.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const test = t => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const Speedomatic = { bignum: () => {} };
      const AugurJS = {
        augur: {
          api: {
            ClaimTradingProceeds: { claimTradingProceeds: () => {} }
          }
        }
      };
      const LoadMarketsInfo = { loadMarketsInfo: () => {} };
      const GetWinningBalance = { getWinningBalance: () => {} };
      const UpdateAssets = {};
      const claimTradingProceeds = proxyquire(
        "../../../src/modules/positions/actions/claim-trading-proceeds.js",
        {
          "../../../services/augurjs": AugurJS,
          "../../markets/actions/load-markets-info": LoadMarketsInfo,
          "../../reports/actions/get-winning-balance": GetWinningBalance
        }
      ).default;
      sinon.stub(Speedomatic, "bignum").callsFake(n => createBigNumber(n, 10));
      if (t.failCall) {
        sinon
          .stub(AugurJS.augur.api.ClaimTradingProceeds, "claimTradingProceeds")
          .callsFake(p => {
            store.dispatch({
              type: "CLAIM_MARKETS_TRADING_PROCEEDS",
              _market: p._market
            });
            p.onFailed("ERROR");
          });
      } else {
        sinon
          .stub(AugurJS.augur.api.ClaimTradingProceeds, "claimTradingProceeds")
          .callsFake(p => {
            store.dispatch({
              type: "CLAIM_MARKETS_TRADING_PROCEEDS",
              _market: p._market
            });
            p.onSuccess(p.markets);
          });
      }
      sinon
        .stub(LoadMarketsInfo, "loadMarketsInfo")
        .callsFake((marketIds, callback) => (dispatch, getState) => {
          dispatch({ type: "LOAD_MARKETS_INFO", marketIds });
        });
      sinon
        .stub(GetWinningBalance, "getWinningBalance")
        .callsFake((marketIds, callback) => (dispatch, getState) => {
          dispatch({ type: "GET_WINNING_BALANCE", marketIds });
        });
      store.dispatch(claimTradingProceeds(t.marektId));
      t.assertions(store.getActions());
      store.clearActions();
    });
  };

  test({
    description: "no marketId",
    state: {
      universe: {
        id: "0xb1",
        currentReportingWindowAddress: 7
      },
      loginAccount: {
        address: "0xb0b"
      },
      marketId: null
    },
    assertions: actions => {
      assert.deepEqual(actions, []);
    }
  });

  test({
    description: "account not logged in",
    state: {
      universe: {
        id: "0xb1",
        currentReportingWindowAddress: 7
      },
      loginAccount: {
        address: null
      }
    },
    marketId: "0x0000001",
    assertions: actions => {
      assert.deepEqual(actions, []);
    }
  });

  test({
    description: "claim successful",
    state: {
      universe: {
        id: "0xb1",
        currentReportingWindowAddress: 7
      },
      loginAccount: {
        address: "0xb0b"
      }
    },
    marketId: "0x0000001",
    assertions: actions => {
      assert.deepEqual(actions, []);
    }
  });

  test({
    description: "claim failed",
    state: {
      universe: {
        id: "0xb1",
        currentReportingWindowAddress: 7
      },
      loginAccount: {
        address: "0xb0b"
      }
    },
    marketId: "0x0000001",
    failCall: true,
    assertions: actions => {
      assert.deepEqual(actions, []);
    }
  });
});
