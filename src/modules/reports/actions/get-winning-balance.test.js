import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import { YES_NO } from "modules/common-elements/constants";

import { getWinningBalance } from "modules/reports/actions/get-winning-balance";

import { updateMarketsData } from "modules/markets/actions/update-markets-data";

import { augur } from "services/augurjs";

jest.mock("modules/markets/actions/update-markets-data");
jest.mock("services/augurjs");

describe("modules/reports/actions/get-winning-balance.js", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  describe("getWinningBalance", () => {
    const ACTIONS = {
      UPDATE_MARKETS_DATA: "UPDATE_MARKETS_DATA"
    };

    beforeEach(() => {
      augur.augurNode.submitRequest.mockImplementation(
        (methodName, args, callback) => {
          expect(methodName).toEqual("getWinningBalance");
          expect(args).toEqual({
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
      );

      updateMarketsData.mockImplementation(marketsData => ({
        type: ACTIONS.UPDATE_MARKETS_DATA,
        data: {
          marketsData
        }
      }));
    });

    test("Should fire correct calls.", () => {
      const store = mockStore({
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
      });

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
      expect(actual).toEqual(expected);
    });
  });
});
