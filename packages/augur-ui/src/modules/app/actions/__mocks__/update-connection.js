const mockUpdateConnection = jest.genMockFromModule(
  "../update-connection.js"
);

mockUpdateConnection.updateConnectionStatus = () => ({
  type: "UPDATE_CONNECTION_STATUS"
});

mockUpdateConnection.updateAugurNodeConnectionStatus = () => ({
  type: "UPDATE_AUGUR_NODE_CONNECTION_STATUS"
});

module.exports = mockUpdateConnection;
