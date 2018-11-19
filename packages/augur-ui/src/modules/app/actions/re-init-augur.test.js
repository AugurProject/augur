import mockStore from "test/mockStore";
import { reInitAugur } from "./re-init-augur";
import * as initAugurModule from "modules/app/actions/init-augur";
import * as lodash from "lodash";

jest.mock("modules/app/actions/init-augur");
jest.mock("lodash");

describe("app/actions/re-init-augur", () => {
  const t1 = {
    state: {
      connection: {
        isConnected: false,
        isConnectedToAugurNode: true,
        isReconnectionPaused: false
      }
    },
    params: {
      history: { push: arg => expect(arg).toEqual(arg, "/categories") }
    },
    mockDebounce: (func, wait) => {
      expect(wait).toBe(3000);
      expect(typeof func).toStrictEqual("function");
      return func;
    },
    assertions: actions =>
      expect(actions).toEqual([
        {
          type: "UPDATE_MODAL",
          data: {
            modalOptions: {
              type: "MODAL_NETWORK_DISCONNECTED",
              connection: {
                isConnected: false,
                isConnectedToAugurNode: true,
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
                isConnected: false,
                isConnectedToAugurNode: true,
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
                isConnected: false,
                isConnectedToAugurNode: true,
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
                isConnected: false,
                isConnectedToAugurNode: true,
                isReconnectionPaused: false
              },
              env: undefined
            }
          }
        },
        { type: "CONNECT_AUGUR" },
        { type: "CONNECT_AUGUR" },
        { type: "CONNECT_AUGUR" },
        { type: "CONNECT_AUGUR" }
      ])
  };

  describe.each([t1])("Re-init Augur", t => {
    let store;
    let connectAugurSpy;
    let lodashSpy;
    let connectAugurCallCount;

    beforeEach(() => {
      store = mockStore.mockStore(t.state);
      connectAugurCallCount = 0;
      connectAugurSpy = jest
        .spyOn(initAugurModule, "connectAugur")
        .mockImplementation((history, env, isInitialConnection, cb) => {
          connectAugurCallCount += 1;
          expect(history).toEqual(t.params.history);
          expect(isInitialConnection).toBe(false);
          expect(env).toEqual(store.getState().env);
          // fail the first 3 attempts and then finally pass empty cb.
          if (connectAugurCallCount > 3) {
            cb();
          } else {
            cb({ error: "some error", message: "unable to connect" });
          }
          // just to confirm this is actually called.
          return { type: "CONNECT_AUGUR" };
        });
      lodashSpy = jest
        .spyOn(lodash, "debounce")
        .mockImplementation(t.mockDebounce);
    });

    afterEach(() => {
      connectAugurSpy.mockReset();
      lodashSpy.mockReset();
    });

    test("Handled calling connectAugur more than once if there is an error the first time", done => {
      store.dispatch(reInitAugur(t.params.history));
      const actual = store.getActions();
      t.assertions(actual);
      done();
    });
  });
});
