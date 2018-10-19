const moduleObject = jest.genMockFromModule(
  "modules/positions/actions/load-account-trades"
);

let setBehavior = () => {};
moduleObject.loadAccountTrades = jest.fn(() => setBehavior());
moduleObject.loadAccountTrades.__set = func => {
  setBehavior = func;
};

module.exports = moduleObject;
