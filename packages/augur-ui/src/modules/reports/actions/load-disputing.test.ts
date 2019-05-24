import configureMockStore from "redux-mock-store";

import thunk from "redux-thunk";

import { augur } from "services/augurjs";

import { loadDisputing } from "modules/reports/actions/load-disputing";

import {
  loadMarketsDisputeInfo,
  loadMarketsInfoIfNotLoaded
} from "modules/markets/actions/load-markets-info";

jest.mock("modules/markets/actions/load-markets-info");
jest.mock("services/augurjs");

describe("loadDisputing action", () => {
  const universeAddress = "1010101";

  const initialStoreState = {
    universe: {
      id: universeAddress
    }
  };

  let mockStore;
  let store;

  beforeAll(() => {
    mockStore = configureMockStore([thunk]);
  });

  beforeEach(() => {
    augur.augurNode.submitRequest.mockImplementation(() => {});
    loadMarketsDisputeInfo.mockImplementation(() => () => {});
    loadMarketsInfoIfNotLoaded.mockImplementation(() => () => {});

    store = mockStore(initialStoreState);
  });

  describe("upon error", () => {
    let callback;
    let error;

    beforeEach(() => {
      callback = jest.fn();
      error = new Error("An Error Occurred");

      store.dispatch(loadDisputing(callback));
    });

    describe("CROWDSOURCING_DISPUTE", () => {
      test("should be passed to callback passed to action", () => {
        augur.augurNode.submitRequest.mock.calls[0][2](error);
        expect(callback).toHaveBeenCalledWith(error);
      });
    });

    describe("AWAITING_NEXT_WINDOW", () => {
      test("should be passed to callback passed to action", () => {
        augur.augurNode.submitRequest.mock.calls[1][2](error);
        expect(callback).toHaveBeenCalledWith(error);
      });
    });
  });
});
