import testState from "test/testState";
import * as updateConnection from "modules/app/actions/update-connection";
import reducer from "modules/app/reducers/connection";

describe(`modules/app/reducers/connection.js`, () => {
  const thisTestState = Object.assign({}, testState);

  test(`Updates the connection in state`, () => {
    const action = {
      type: updateConnection.UPDATE_CONNECTION_STATUS,
      data: { isConnected: true }
    };
    const expectedOutput = Object.assign({}, thisTestState.connection, {
      isConnected: true
    });
    expect(reducer(thisTestState.connection, action)).toEqual(expectedOutput);
  });

  test(`Updates the Augur Node connection in state`, () => {
    const action = {
      type: updateConnection.UPDATE_AUGUR_NODE_CONNECTION_STATUS,
      data: { isConnectedToAugurNode: true }
    };
    const expectedOutput = Object.assign({}, thisTestState.connection, {
      isConnectedToAugurNode: true
    });
    expect(reducer(thisTestState.connection, action)).toEqual(expectedOutput);
  });

  test(`Updates the augurNodeNetworkId`, () => {
    const action = {
      type: updateConnection.UPDATE_AUGUR_NODE_NETWORK_ID,
      data: { augurNodeNetworkId: "4" }
    };
    const expectedOutput = Object.assign({}, thisTestState.connection, {
      augurNodeNetworkId: "4"
    });
    expect(reducer(thisTestState.connection, action)).toEqual(expectedOutput);
  });

  test(`Updates the isReconnectionPaused variable in the connection object in state`, () => {
    const action = {
      type: updateConnection.UPDATE_IS_RECONNECTION_PAUSED,
      data: { isReconnectionPaused: true }
    };
    const expectedOutput = Object.assign({}, thisTestState.connection, {
      isReconnectionPaused: true
    });
    expect(reducer(thisTestState.connection, action)).toEqual(expectedOutput);
  });
});
