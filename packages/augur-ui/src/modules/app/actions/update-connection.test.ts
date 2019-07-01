import * as action from "modules/app/actions/update-connection";

describe("modules/app/actions/update-connection.js", () => {
  test("Updated the ethereum node connection status", () => {
    const out = {
      type: action.UPDATE_CONNECTION_STATUS,
      data: { isConnected: true }
    };
    expect(action.updateConnectionStatus(true)).toEqual(out);
  });

  test("Updates the isReconnectionPaused variable", () => {
    const out = {
      type: action.UPDATE_IS_RECONNECTION_PAUSED,
      data: { isReconnectionPaused: true }
    };
    expect(action.updateIsReconnectionPaused(true)).toEqual(out);
  });
});
