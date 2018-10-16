const mockUpdateContractAPI = jest.genMockFromModule(
  "../update-contract-api.js"
);

mockUpdateContractAPI.updateFunctionsAPI = () => ({
  type: "UPDATE_FUNCTIONS_API"
});

mockUpdateContractAPI.updateEventsAPI = () => ({
  type: "UPDATE_EVENTS_API"
});

module.exports = mockUpdateContractAPI;
