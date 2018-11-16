import * as action from "modules/app/actions/update-connection";

describe("modules/app/actions/update-connection.js", () => {
  test("Updated the ethereum node connection status", () => {
    const out = {
      type: action.UPDATE_CONNECTION_STATUS,
      data: { isConnected: true }
    };
    expect(action.updateConnectionStatus(true)).toEqual(out);
  });

  test("Updates the augur node connection status", () => {
    const out = {
      type: action.UPDATE_AUGUR_NODE_CONNECTION_STATUS,
      data: { isConnectedToAugurNode: true }
    };
    expect(action.updateAugurNodeConnectionStatus(true)).toEqual(out);
  });

  test("Updates the augur node network id", () => {
    const out = {
      type: action.UPDATE_AUGUR_NODE_NETWORK_ID,
      data: { augurNodeNetworkId: "4" }
    };
    expect(action.updateAugurNodeNetworkId("4")).toEqual(out);
  });

  test("Updates the isReconnectionPaused variable", () => {
    const out = {
      type: action.UPDATE_IS_RECONNECTION_PAUSED,
      data: { isReconnectionPaused: true }
    };
    expect(action.updateIsReconnectionPaused(true)).toEqual(out);
  });
});
