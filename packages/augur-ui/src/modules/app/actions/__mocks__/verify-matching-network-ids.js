const mockVerifyMatchingNetworkIds = jest.genMockFromModule(
  "../verify-matching-network-ids.js"
);

mockVerifyMatchingNetworkIds.verifyMatchingNetworkIds = callback => dispatch =>
  callback(null, true);

module.exports = mockVerifyMatchingNetworkIds;
