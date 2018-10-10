const mockUpdateEnv = jest.genMockFromModule(
  "modules/app/actions/update-env.js"
);

mockUpdateEnv.updateEnv = () => ({
  type: "UPDATE_ENV"
});

module.exports = mockUpdateEnv;
