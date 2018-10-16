const mockUpdateEnv = jest.genMockFromModule(
  "../update-env.js"
);

mockUpdateEnv.updateEnv = () => ({
  type: "UPDATE_ENV"
});

module.exports = mockUpdateEnv;
