import mockStore from "test/mockStore";
import {
  handleAugurNodeDisconnect,
  handleEthereumDisconnect
} from "./disconnect-handlers";
import * as connectAugurModule from "modules/app/actions/init-augur";
import * as lodash from "lodash";
import * as updateConnectionModule from "modules/app/actions/update-connection";

jest.mock("modules/app/actions/init-augur");
jest.mock("lodash");
jest.mock("modules/app/actions/update-connection");

describe("events/actions/disconnect-handlers", () => {
  let store;
  let state;
  let params;
  const mockHistory = { push: arg => expect(arg).toEqual("/categories") };

  describe("handleAugurNodeDisconnect", () => {
    let initAugurSpy;
    let lodashSpy;
    let updateConnectionSpy;

    beforeEach(() => {
      initAugurSpy = jest
        .spyOn(connectAugurModule, "connectAugur")
        .mockImplementation((history, env, isInitialConnection, cb) => {
          expect(history).toEqual(params.history);
          expect(isInitialConnection).toBe(false);
          expect(env).toEqual(store.getState().env);
          cb();
          // just to confirm this is actually called.
          return { type: "CONNECT_AUGUR" };
        });

      lodashSpy = jest
        .spyOn(lodash, "debounce")
        .mockImplementation((func, wait) => {
          expect(wait).toBe(3000);
          expect(typeof func).toEqual("function");
          return cb => {
            // flip the connection.isReconnectionPaused value, should go from false to true, then true to false on the 2nd call.
            state.connection.isReconnectionPaused = !state.connection
              .isReconnectionPaused;
            func(cb);
          };
        });

      updateConnectionSpy = jest
        .spyOn(updateConnectionModule, "updateAugurNodeConnectionStatus")
        .mockImplementation(isConnected => {
          state.connection.isConnectedToAugurNode = isConnected;
          return {
            type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS",
            isConnected: false
          };
        });
    });

    afterEach(() => {
      initAugurSpy.mockReset();
      lodashSpy.mockReset();
      updateConnectionSpy.mockReset();
    });

    test("handled a augurNode disconnection event with pausedReconnection", done => {
      state = {
        connection: {
          isConnected: true,
          isConnectedToAugurNode: true,
          isReconnectionPaused: false
        }
      };
      params = {
        history: mockHistory
      };

      store = mockStore.mockStore(state);
      store.dispatch(handleAugurNodeDisconnect(params.history));
      expect(store.getActions()).toEqual([
        {
          type: "UPDATE_MODAL",
          data: {
            modalOptions: {
              type: "MODAL_NETWORK_DISCONNECTED",
              connection: {
                isConnected: true,
                isConnectedToAugurNode: false,
                isReconnectionPaused: false
              },
              env: undefined
            }
          }
        },
        { type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS", isConnected: false },
        {
          type: "UPDATE_MODAL",
          data: {
            modalOptions: {
              type: "MODAL_NETWORK_DISCONNECTED",
              connection: {
                isConnected: true,
                isConnectedToAugurNode: false,
                isReconnectionPaused: false
              },
              env: undefined
            }
          }
        },
        {
          type: "UPDATE_MODAL",
          data: {
            modalOptions: {
              type: "MODAL_NETWORK_DISCONNECTED",
              connection: {
                isConnected: true,
                isConnectedToAugurNode: false,
                isReconnectionPaused: false
              },
              env: undefined
            }
          }
        },
        { type: "CONNECT_AUGUR" }
      ]);
      done();
    });
  });

  describe("handleEthereumDisconnect", () => {
    let initAugurSpy;
    let lodashSpy;
    let updateConnectionSpy;

    beforeEach(() => {
      initAugurSpy = jest
        .spyOn(connectAugurModule, "connectAugur")
        .mockImplementation((history, env, isInitialConnection, cb) => {
          expect(history).toEqual(mockHistory);
          expect(isInitialConnection).toBe(false);
          expect(env).toEqual(store.getState().env);
          cb();
          // just to confirm this is actually called.
          return { type: "CONNECT_AUGUR" };
        });

      lodashSpy = jest
        .spyOn(lodash, "debounce")
        .mockImplementation((func, wait) => {
          expect(wait).toBe(3000);
          expect(typeof func).toEqual("function");
          return cb => {
            // flip the connection.isReconnectionPaused value, should go from false to true, then true to false on the 2nd call.
            state.connection.isReconnectionPaused = !state.connection
              .isReconnectionPaused;
            func(cb);
          };
        });

      updateConnectionSpy = jest
        .spyOn(updateConnectionModule, "updateConnectionStatus")
        .mockImplementation(isConnected => {
          state.connection.isConnected = isConnected;
          return { type: "UPDATE_CONNECTION_STATUS", isConnected: false };
        });
    });

    afterEach(() => {
      initAugurSpy.mockReset();
      lodashSpy.mockReset();
      updateConnectionSpy.mockReset();
    });

    test("handled an ethereumNode disconnection event with pausedReconnection", done => {
      params = {
        history: mockHistory
      };
      state = {
        connection: {
          isConnected: true,
          isConnectedToAugurNode: true,
          isReconnectionPaused: false
        }
      };
      store = mockStore.mockStore(state);
      store.dispatch(handleEthereumDisconnect(params.history));
      done();
    });
  });
});
