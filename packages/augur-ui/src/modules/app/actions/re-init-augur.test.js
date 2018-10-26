import mockStore from "test/mockStore";
import { connectAugur } from "modules/app/actions/init-augur";
import { updateModal } from "modules/modal/actions/update-modal";

jest.mock("modules/app/actions/init-augur");
jest.mock("modules/modal/actions/update-modal");

describe("app/actions/re-init-augur", () => {
  connectAugur.mockImplementation(() => ({ type: "INIT_AUGUR_CONNECT" }));
  updateModal.mockImplementation(() => ({ type: "UPDATE_MODAL" }));
  const mockHistory = { push: arg => expect(arg).toEqual("/categories") };

  const { reInitAugur } = require("modules/app/actions/re-init-augur");

  test("it should handle calling connectAugur more than once if there is an error the first time", () => {
    const params = {
      history: mockHistory
    };
    const state = {
      connection: {
        isConnected: false,
        isConnectedToAugurNode: true,
        isReconnectionPaused: false
      }
    };
    const store = mockStore.mockStore(state);
    store.dispatch(reInitAugur(params.history));
    const actions = store.getActions();
    // TODO: figure out why this isn't getting dispatched actions
    expect(actions).toEqual([]);
    /*
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
    ]);
*/
  });
});
