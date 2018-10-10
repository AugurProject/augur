const mockLoadUniverse = jest.genMockFromModule(
  "../load-universe.js"
);

mockLoadUniverse.loadUniverse = () => ({
  type: "LOAD_UNIVERSE"
});

module.exports = mockLoadUniverse;
