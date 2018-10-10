const mockUpdateContractAddresses = jest.genMockFromModule(
  "modules/contracts/actions/update-contract-addresses.js"
);

mockUpdateContractAddresses.updateContractAddresses = () => ({
  type: "UPDATE_CONTRACT_ADDRESSES"
});

module.exports = mockUpdateContractAddresses;
