const mockUpdateAssets = jest.genMockFromModule(
  "../update-assets"
);

mockUpdateAssets.updateAssets = data => ({
  type: "UPDATE_ASSETS",
  data
});

module.exports = mockUpdateAssets;
