import configureMockStore from "redux-mock-store";

import thunk from "redux-thunk";

import { augur, constants } from "services/augurjs";

import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { loadReporting } from "modules/reports/actions/load-reporting";

jest.mock("modules/markets/actions/load-markets-info");
jest.mock("services/augurjs");

describe("loadReporting action", () => {
  const loginAccountAddress = "22222222";
  const universeAddress = "1010101";

  const initialStoreState = {
    universe: {
      id: universeAddress
    },
    loginAccount: {
      address: loginAccountAddress
    }
  };

  let mockStore;
  let store;

  beforeAll(() => {
    mockStore = configureMockStore([thunk]);
  });

  beforeEach(() => {
    augur.augurNode.submitRequest.mockImplementation(() => {});
    loadMarketsInfoIfNotLoaded.mockImplementation((marketIds, callback) => {
      callback(null);
      return {
        type: "LOAD_MARKETS_INFO_IF_NOT_LOADED",
        data: {
          marketIds
        }
      };
    });

    store = mockStore(initialStoreState);
  });

  test("should load upcoming designated markets for a given user in side the given universe", () => {
    store.dispatch(loadReporting());

    const checkCall = (
      callIndex,
      method,
      reportingState,
      expectedParams,
      callbackArgs
    ) => {
      expect(augur.augurNode.submitRequest).toHaveBeenNthCalledWith(
        callIndex,
        method,
        {
          reportingState,
          ...expectedParams
        },
        expect.any(Function)
      );
      augur.augurNode.submitRequest.mock.calls[callIndex - 1][2](
        null,
        callbackArgs
      );
    };

    checkCall(
      1,
      "getMarkets",
      constants.REPORTING_STATE.PRE_REPORTING,
      {
        sortBy: "endTime",
        universe: universeAddress,
        designatedReporter: loginAccountAddress
      },
      ["1111"]
    );
    checkCall(
      2,
      "getMarkets",
      constants.REPORTING_STATE.DESIGNATED_REPORTING,
      {
        sortBy: "endTime",
        universe: universeAddress,
        designatedReporter: loginAccountAddress
      },
      ["2222", "3333"]
    );

    checkCall(
      3,
      "getMarkets",
      constants.REPORTING_STATE.OPEN_REPORTING,
      {
        sortBy: "endTime",
        universe: universeAddress
      },
      ["4444"]
    );

    const expected = [
      {
        data: { marketIds: ["1111"] },
        type: "UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS"
      },
      {
        data: {
          marketIds: ["1111"]
        },
        type: "LOAD_MARKETS_INFO_IF_NOT_LOADED"
      },
      {
        data: { marketIds: ["2222", "3333"] },
        type: "UPDATE_DESIGNATED_REPORTING_MARKETS"
      },
      {
        data: {
          marketIds: ["2222", "3333"]
        },
        type: "LOAD_MARKETS_INFO_IF_NOT_LOADED"
      },
      {
        data: { marketIds: ["4444"] },
        type: "UPDATE_OPEN_REPORTING_MARKETS"
      },
      {
        data: {
          marketIds: ["4444"]
        },
        type: "LOAD_MARKETS_INFO_IF_NOT_LOADED"
      }
    ];
    const actual = store.getActions();
    // actions include load market info actions
    expect(actual).toHaveLength(6);
    expect(actual).toEqual(expected);
  });

  describe("upon error", () => {
    test("should be passed to callback passed to action", () => {
      const error = new Error("An Error Occurred");
      const callback = jest.fn();

      augur.augurNode.submitRequest.mockImplementation(
        (placeholder1, placeholder2, cb) => cb(error)
      );

      store.dispatch(loadReporting(callback));

      expect(augur.augurNode.submitRequest).toHaveBeenCalled();

      expect(callback).toHaveBeenCalledWith(error);
    });
  });
});
