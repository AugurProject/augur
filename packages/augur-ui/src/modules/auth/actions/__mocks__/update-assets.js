const mockUpdateAssets = jest.genMockFromModule(
  "modules/auth/actions/update-assets"
);

mockUpdateAssets.updateAssets = data => ({
  type: "UPDATE_ASSETS",
  data
});

module.exports = mockUpdateAssets;
