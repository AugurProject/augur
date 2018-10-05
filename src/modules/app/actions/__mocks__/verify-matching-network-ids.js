const mockVerifyMatchingNetworkIds = jest.genMockFromModule(
  "modules/app/actions/verify-matching-network-ids.js"
);

mockVerifyMatchingNetworkIds.verifyMatchingNetworkIds = callback => dispatch =>
  callback(null, true);

module.exports = mockVerifyMatchingNetworkIds;
