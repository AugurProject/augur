const mockLoadUniverse = jest.genMockFromModule(
  "modules/app/actions/load-universe.js"
);

mockLoadUniverse.loadUniverse = () => ({
  type: "LOAD_UNIVERSE"
});

module.exports = mockLoadUniverse;
