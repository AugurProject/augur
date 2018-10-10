const mockUpdateContractAddresses = jest.genMockFromModule(
  "../update-contract-addresses.js"
);

mockUpdateContractAddresses.updateContractAddresses = () => ({
  type: "UPDATE_CONTRACT_ADDRESSES"
});

module.exports = mockUpdateContractAddresses;
