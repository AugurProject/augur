import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

describe("modules/orders/selectors/positions-plus-asks", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  describe("selectPositionsPlusAsks", () => {
    const positionsPlusAsks = require("modules/orders/selectors/positions-plus-asks");

    test("should return the expected value with no positions", () => {
      const state = {
        loginAccount: {}
      };
      const store = mockStore(state || {});
      const actual = positionsPlusAsks.selectPositionsPlusAsks(
        store.getState()
      );
      expect(actual).toEqual(null);
    });

    test("should return the expected value with positions and no market order book", () => {
      const state = {
        loginAccount: {},
        accountPositions: {
          "0xMARKETID": {}
        },
        orderBooks: {}
      };
      const store = mockStore(state || {});
      const actual = positionsPlusAsks.selectPositionsPlusAsks(
        store.getState()
      );
      const expected = {
        "0xMARKETID": {}
      };
      expect(actual).toEqual(expected);
    });

    test("should return the expected value with positions and market order book", () => {
      const state = {
        loginAccount: {},
        accountPositions: {
          "0xMARKETID": {}
        },
        orderBooks: {
          "0xMARKETID": {
            sell: [{}]
          }
        }
      };
      const store = mockStore(state || {});
      const actual = positionsPlusAsks.selectPositionsPlusAsks(
        store.getState()
      );
      const expected = {
        "0xMARKETID": {}
      };
      expect(actual).toEqual(expected);
    });
  });
});
