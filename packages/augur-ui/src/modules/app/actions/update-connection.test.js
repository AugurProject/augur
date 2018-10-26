import * as action from "modules/app/actions/update-connection";

describe("modules/app/actions/update-connection.js", () => {
  test(`should update the ethereum node connection status`, () => {
    const actual = action.updateConnectionStatus(true);
    const expected = {
      type: action.UPDATE_CONNECTION_STATUS,
      data: { isConnected: true }
    };
    expect(actual).toEqual(expected);
  });

  test(`should update the augur node connection status`, () => {
    const actual = action.updateAugurNodeConnectionStatus(true);
    const expected = {
      type: action.UPDATE_AUGUR_NODE_CONNECTION_STATUS,
      data: { isConnectedToAugurNode: true }
    };
    expect(actual).toEqual(expected);
  });

  test(`should update the augur node network id`, () => {
    const actual = action.updateAugurNodeNetworkId("4");
    const expected = {
      type: action.UPDATE_AUGUR_NODE_NETWORK_ID,
      data: { augurNodeNetworkId: "4" }
    };
    expect(actual).toEqual(expected);
  });

  test(`should update the isReconnectionPaused variable`, () => {
    const actual = action.updateIsReconnectionPaused(true);
    const expected = {
      type: action.UPDATE_IS_RECONNECTION_PAUSED,
      data: { isReconnectionPaused: true }
    };
    expect(actual).toEqual(expected);
  });
});
