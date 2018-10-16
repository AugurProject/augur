const mockUpdateBlockchain = jest.genMockFromModule(
  "../update-blockchain"
);

mockUpdateBlockchain.updateBlockchain = data => ({
  type: "UPDATE_BLOCKCHAIN",
  data
});

module.exports = mockUpdateBlockchain;
