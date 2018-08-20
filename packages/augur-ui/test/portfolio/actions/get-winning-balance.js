import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import { YES_NO } from "modules/markets/constants/market-types";

describe("modules/portfolio/actions/get-winning-balance.js", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = t =>
    it(t.description, () => {
      const store = mockStore(t.state || {});

      t.assertions(store);
    });

  describe("getWinningBalance", () => {
    const {
      getWinningBalance,
      __RewireAPI__
    } = require("modules/portfolio/actions/get-winning-balance.js");

    const ACTIONS = {
      UPDATE_MARKETS_DATA: "UPDATE_MARKETS_DATA"
    };

    __RewireAPI__.__Rewire__("augur", {
      augurNode: {
        submitRequest: (methodName, args, callback) => {
          assert.equal(methodName, "getWinningBalance");
          assert.deepEqual(args, {
            marketIds: ["0xdeadbeef"],
            account: "0xb0b"
          });
          return callback(null, [
            {
              marketId: "0xdeadbeef",
              winnings: "1000000000000000"
            }
          ]);
        }
      }
    });

    __RewireAPI__.__Rewire__("updateMarketsData", marketsData => ({
      type: ACTIONS.UPDATE_MARKETS_DATA,
      data: {
        marketsData
      }
    }));

    test({
      description: `Should fire correct calls.`,
      state: {
        loginAccount: {
          address: "0xb0b"
        },
        marketsData: {
          "0xdeadbeef": {
            maxPrice: 1,
            minPrice: 0,
            numTicks: 10000,
            marketType: YES_NO
          }
        }
      },
      assertions: store => {
        store.dispatch(getWinningBalance(["0xdeadbeef"]));

        const actual = store.getActions();

        const expected = [
          {
            type: ACTIONS.UPDATE_MARKETS_DATA,
            data: {
              marketsData: {
                "0xdeadbeef": {
                  outstandingReturns: "0.001"
                }
              }
            }
          }
        ];

        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`);
      }
    });
  });
});
