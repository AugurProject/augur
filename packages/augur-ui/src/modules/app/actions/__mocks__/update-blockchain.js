const mockUpdateBlockchain = jest.genMockFromModule(
  "modules/app/actions/update-blockchain"
);

mockUpdateBlockchain.updateBlockchain = data => ({
  type: "UPDATE_BLOCKCHAIN",
  data
});

module.exports = mockUpdateBlockchain;
